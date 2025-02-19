
const fs = require("fs");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to extract user details from the token
const extractUserFromToken = (req) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded; // Expected { email, name, userId }
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

// Function to upload PDF to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "invoices" }, 
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Generate Invoice
exports.generateInvoice = async (req, res) => {
    try {
        const user = extractUserFromToken(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const { amount, paymentId } = req.body;
        if (!amount || !paymentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let pdfBuffer = [];
        const doc = new PDFDocument();

        doc.on("data", chunk => pdfBuffer.push(chunk));

        doc.on("end", async () => {
            try {
                const finalBuffer = Buffer.concat(pdfBuffer);
                const invoiceUrl = await uploadToCloudinary(finalBuffer);
                res.json({ message: "Invoice generated", invoiceUrl });
            } catch (error) {
                console.error("Error uploading PDF to Cloudinary:", error);
                res.status(500).json({ message: "Failed to upload PDF" });
            }
        });

        // Invoice Header
        doc.fontSize(20).text("Payment Invoice", { align: "center" }).moveDown();
        doc.fontSize(12).text(`Invoice Date: ${moment().format("MMMM Do YYYY")}`, { align: "right" });

        doc.moveDown();
        doc.text(`Client Name: ${user.name}`);
        doc.text(`Client Email: ${user.email}`);
        doc.text(`Payment ID: ${paymentId}`);
        doc.text(`Amount Paid: ₹${amount}`);
        doc.text(`Payment Status: Successful`);

        doc.moveDown();
        doc.text("Thank you for your payment!", { align: "center" });

        doc.end();
    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ message: "Failed to generate invoice" });
    }
};

// Fetch payment details using session_id
//---------------------------------------

exports.fetchPaymentdetails = async (req , res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ error: "Payment session not found" });
        }

        res.json({
            paymentId: session.id,
            customer_email: session.customer_email,
            amount_total: session.amount_total / 100 // Convert from cents to currency
        });
    } catch (error) {
        console.error("Error retrieving payment details:", error);
        res.status(500).json({ error: "Failed to fetch payment details" });
    }
}