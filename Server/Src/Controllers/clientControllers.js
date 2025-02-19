require('dotenv').config()
const Client = require('../Model/clientModel')
const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')
const Message = require('../Model/messageModel')
const Appointment = require('../Model/appoinmentModel')
const Case = require('../Model/caseModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Sign Up for Client 
//-------------------

exports.signUpClient = async (req, res) => {
    try {
        console.log("Signup request received:", req.body)
        const { usertype, clientname, mobile, email, state, district, username, password, advocateEmail, confirmPassword } = req.body

        if (!usertype || !clientname || !mobile || !email || !state || !district || !username || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required..." })
        }
        if (password != confirmPassword) {
            return res.status(404).json({ success: false, message: "Password and confirm passwrod should be same" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        let client = await Client.findOne({ email })
        if (client) {
            return res.status(400).json({ success: false, message: "Client Exists" })
        }

        let advocate = await Advocate.findOne({ email: advocateEmail })
        if (!advocate) {
            return res.status(400).json({ success: false, message: "Advocate does not exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        client = new Client({ usertype, clientname, mobile, email, state, district, username, password: hashedPassword, advocateEmail })
        console.log("Client object before saving:", client)
        await client.save()
        console.log("Client saved successfully");

        res.status(200).json({ success: true, message: "Client registered Successfully", user: client })

    } catch (error) {
        console.error("Error in signUpClient:", error.message)
        console.error("Stack Trace:", error.stack)
        res.status(500).json({ success: false, message: "Server Error", error: error.message, stack: error.stack })
    }
}

//Booking Or Contacting Advocate 
//-------------------------------

exports.bookAppointment = async (req, res) => {
    const { advocateEmail, date, time, subject, message } = req.body;
    const clientEmail = req.user.email; 
    const clientName = req.user.name;  // Ensure name is extracted from JWT

    console.log("Advocate Email from Request:", advocateEmail); // Debugging

    // Validate required fields
    if (!advocateEmail || !date || !time || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Ensure advocate email is provided
        if (!advocateEmail) {
            return res.status(400).json({ message: "Advocate email is required" });
        }

        // Fetch advocate details
        const advocate = await Advocate.findOne({ email: advocateEmail });
        if (!advocate) {
            return res.status(404).json({ message: "Advocate not found" });
        }

        // Check if appointment slot is already booked
        const existingAppointment = await Appointment.findOne({ advocateEmail, date, time });
        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked. Please choose another time." });
        }

        // Create and save appointment
        const newAppointment = new Appointment({
            clientEmail,
            clientName,
            advocateEmail,
            advocateName: `${advocate.firstname} ${advocate.lastname}`,
            date,
            time,
            subject,
            message
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment request sent successfully!" });

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Getting own cases
// -----------------

exports.getClientCases = async (req, res) => {
    try {
        // Extract client email from the token (req.user is set by authMiddleware)
        const { email } = req.user;

        if (!email) {
            return res.status(400).json({ message: "Client email is missing from token" });
        }

        console.log("Extracted email from token:", email);

        // Step 1: Find client using the email
        const client = await Client.findOne({ email });

        if (!client) {
            console.error("Client not found for email:", email);
            return res.status(404).json({ message: "Client not found" });
        }

        console.log("Client found:", client);

        // Step 2: Use the client's name to fetch cases
        const cases = await Case.find({ clientname: client.clientname });

        if (!cases.length) {
            console.warn("No cases found for client:", client.clientname);
            return res.status(404).json({ message: "No cases found for this client" });
        }

        console.log("Cases fetched:", cases.length);

        res.status(200).json({ message: "Cases fetched successfully", cases });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//Sending Message To Corresponding Case Advocate
//----------------------------------------------

exports.sendMessageToAdvocate = async (req, res) => {
    const { caseId, advocateEmail, message } = req.body;

    if (!caseId || !advocateEmail || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const advocate = await Advocate.findOne({ email: advocateEmail }) ||
            await JrAdvocate.findOne({ email: advocateEmail });

        if (!advocate) {
            return res.status(404).json({ message: "No advocate found" });
        }

        // Create and save the message
        const newMessage = new Message({
            caseId,
            advocateEmail,
            clientname: req.user.clientname,
            clientEmail: req.user.email, // From JWT
            message
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
