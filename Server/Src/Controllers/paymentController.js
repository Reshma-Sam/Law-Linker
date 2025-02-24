require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require('../Model/paymentModel')


// Payment handler
//----------------
exports.payment = async (req, res) => {
    try {
        const { amount, clientName, clientEmail, recipientEmail } = req.body; // Destructure the required fields from the request body
        const token = req.headers.authorization.split(" ")[1]; // Extract the token from the header
        const user = req.user; // Get user info from token

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Log the user details for debugging
        console.log("User info:", user);

        // Make API call to Stripe (or another payment gateway) to create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents for Stripe (multiplying by 100 as Stripe expects the amount in the smallest currency unit)
            currency: "inr",
            receipt_email: clientEmail, // Using clientEmail to send receipt
            metadata: {
                clientName: clientName, // Optional: store client name in metadata for reference
                recipientEmail,
            },
        });

        // Log paymentIntent to check if it contains the paymentId
        console.log("Stripe Payment Intent backend:", paymentIntent);

        if (!paymentIntent.id) {
            throw new Error("Payment ID is missing from the paymentIntent.");
        }

        if (!paymentIntent.client_secret) {
            throw new Error("Payment Intent did not return a valid client secret.");
        }

        // Save payment details to database
        const paymentDetails = {
            paymentId: paymentIntent.id,  // Ensure this is passed correctly
            amount: amount,
            paymentStatus: paymentIntent.status,
            receiptEmail: clientEmail,  // Store the client's email for receipt
            paymentMethod: 'card', // Assuming card payment method; update as necessary
            clientName: clientName,
            recipientEmail,
        };

        // Create a new payment document and save it to the database
        const paymentRecord = new Payment({
            userId: user.id,  // userId passed from the token
            amount,
            paymentStatus: paymentIntent.status,
            receiptEmail: clientEmail,
            paymentMethod: 'card', // You can update this based on the payment method
            paymentId: paymentIntent.id, // Ensure paymentId is passed,
            recipientEmail,
        });

        // Try saving the payment record to the database
            await paymentRecord.save();
            // Return clientSecret and paymentId to frontend for confirmation
            res.json({ clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id });
            console.log("Payment details saved successfully!");

    } catch (error) {
        console.error("Error during payment:", error);
        res.status(500).json({ message: "Payment processing failed." });
    }
};

//Saving Payment History
//----------------------

exports.savePaymentDetails = async (paymentIntent, clientId, clientEmail, recipientEmail) => {
    try {
        // Ensure required parameters are provided
        if (!paymentIntent || !clientId || !clientEmail || !recipientEmail) {
            console.error("Missing required payment details.");
            return;
        }

        // Create a new payment entry in the database
        const payment = new Payment({
            userId: clientId,  // Store the ID of the paying client
            paymentId: paymentIntent.id, // Payment ID from Stripe
            amount: paymentIntent.amount_received / 100, // Convert amount from cents to INR
            paymentStatus: paymentIntent.status, // Payment status (e.g., succeeded, failed)
            receiptEmail: clientEmail, // Email of the person making the payment
            paymentMethod: paymentIntent.payment_method_types?.[0] || "unknown", // Payment method used
            recipientEmail: recipientEmail, // NEW FIELD: Email of the person receiving the payment
            date: new Date(), // Timestamp when payment was made
        });

        // Save the payment details in the database
        await payment.save();
        console.log("Payment details saved successfully.");
    } catch (error) {
        console.error("Error saving payment details:", error);
    }
};


// Backend: Get payment history of a logged-in client
//---------------------------------------------------

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.id;  // Corrected from req.user?.userid to req.user?.id
        if (!userId) {
            console.error("User ID not found in token.");
            return res.status(401).json({ message: 'Unauthorized. User not identified.' });
        }

        console.log("Fetching payments for user ID:", userId);
        const payments = await Payment.find({ userId }).sort({ date: -1 });

        // Transform payment data
        const formattedPayments = payments.map(payment => ({
            id: payment.paymentId,               // Match frontend expectation
            recipientEmail: payment.recipientEmail,
            amount: payment.amount,
            currency: "INR",                     // Since MongoDB doesn't store currency, add a default
            status: payment.paymentStatus,
            created: payment.date,               // MongoDB's 'date' field
        }));

        res.json({ success: true, message: "Successfully retrieved payment history", payments: formattedPayments });
    } catch (error) {
        console.error("Error fetching user's payment history:", error);
        res.status(500).json({ error: error.message });
    }
};

// Backend: Get payment history of a logged-in advocate
//------------------------------------------------------

exports.getPaymentReciepientHistory = async (req, res) => {
    try {
        const loggedInAdvocateEmail = req.user.email; // From authMiddleware

        if (!loggedInAdvocateEmail) {
            return res.status(400).send("Logged-in advocate email not found.");
        }

        // Fetch payments where recipientEmail matches the logged-in advocate's email
        const payments = await Payment.find({ recipientEmail: loggedInAdvocateEmail });

        if (payments.length === 0) {
            return res.status(404).send("No payments found for this advocate.");
        }

        res.status(200).json({ success: true, payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).send("Server error.");
    }
};


//Webhook 
//-------

exports.webhook = async (req, res) => {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object; // Contains a PaymentIntent object
            console.log('PaymentIntent was successful!', paymentIntent);
            break;
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object;
            console.log('Payment failed:', paymentFailed);
            break;
        // Add other cases for other event types if needed
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
}