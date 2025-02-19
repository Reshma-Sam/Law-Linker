require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../Model/adminModel')
const Advocate = require('../Model/advocateModel')
const Client = require('../Model/clientModel')
const JrAdvocate = require('../Model/jrAdvocateModel')
const Case = require('../Model/caseModel')
const bcrypt = require('bcryptjs')


// Sign Up for admin
// -----------------
exports.signUpAdmin = async (req, res) => {
    try {
        // console.log("Signup request received:", req.body)
        const { usertype, firstname, lastname, mobile, email, username, password, confirmPassword } = req.body

        if (!usertype || !firstname || !lastname || !mobile || !email || !username || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (password != confirmPassword) {
            return res.status(400).json({ Success: false, message: "Password and confirm passwrod should be same" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        let admin = await Admin.findOne({ email })
        if (admin) {
            return res.status(400).json({ success: false, message: "Admin Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        admin = new Admin({ usertype, firstname, lastname, mobile, email, username, password: hashedPassword, createdBy: new mongoose.Types.ObjectId() })
        await admin.save()
        console.log("Admin registered successfully:", admin);
        res.status(201).json({ Success: true, message: "Admin registered Successfully", user: admin })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
        console.error("Error in signUpAdmin:", error)     // Log full error
    }
}

// Create Advocate By Admin
//--------------------------

exports.createAdvocate = async (req, res) => {
    try {
        const { usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password, confirmPassword } = req.body

        if (!usertype || !firstname || !lastname || !mobile || !email || !barcodenumber || !specialization || !state || !district || !username || !password || !confirmPassword) {
            return res.status(400).json({ sucess: false, message: "All fiels are required" })
        }
        if (password != confirmPassword) {
            return res.status(400).json({ success: false, message: "Password and confirm passwrod should be same" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        console.log("Request User:", req.user)

        let advocate = await Advocate.findOne({ email })
        if (advocate) {
            return res.status(400).json({ message: "Advocate Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        advocate = new Advocate({ usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password: hashedPassword, createdBy: req.user ? req.user.id : null })
        await advocate.save()
        res.status(201).json({ success: true, message: "Advocate registered Successfully by Admin", user: advocate })

    } catch (error) {
        console.error("Create Advocate Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

// Create Client By Admin
//-----------------------

exports.createClient = async (req, res) => {
    try {
        const { usertype, clientname, mobile, email, state, district, username, password, confirmPassword, advocateFirstName, advocateLastName } = req.body

        if (!usertype || !clientname || !mobile || !email || !state || !district || !username || !password || !confirmPassword || !advocateFirstName || !advocateLastName) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (password != confirmPassword) {
            return res.status(400).json({ Success: false, message: "Password and confirm passwrod should be same." })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }
        let client = await Client.findOne({ email })
        if (client) {
            return res.status(400).json({ message: "Client Exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        client = new Client({ usertype, clientname, mobile, email, state, district, username, password: hashedPassword, advocateFirstName, advocateLastName, createdBy: req.user.id })
        await client.save()
        res.status(200).json({ Success: true, message: "Client registered Successfully By Admin.", user: client })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

// Create Jr.Advocate By Admin
//-----------------------------

exports.createJrAdvocate = async (req, res) => {
    try {
        const { usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password, confirmPassword } = req.body

        if (!usertype || !firstname || !lastname || !mobile || !email || !barcodenumber || !specialization || !state || !district || !username || !password || !confirmPassword) {
            return res.status(400).json({ sucess: false, message: "All fiels are required" })
        }
        if (password != confirmPassword) {
            return res.status(400).json({ Success: false, message: "Password and confirm passwrod should be same" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        let jradvocate = await JrAdvocate.findOne({ $or: [{ email }, { username }] })
        if (jradvocate) {
            return res.status(400).json({ message: "Jr.Advocate Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        jradvocate = new JrAdvocate({ usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password: hashedPassword, createdBy: req.user.id })
        await jradvocate.save()
        res.status(201).json({ Success: true, message: "Jr.Advocate registered Successfully by Admin", user: jradvocate })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

//Retrieving all admin
//--------------------

exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await Admin.find();  // Fetch all advocates from the collection

        if (!admin || admin.length === 1) {
            return res.status(404).json({ success: false, message: 'Only you are here as Admin...' });
        }

        res.status(200).json({ success: true, message: 'Admins retrieved successfully', admin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

//Retrieving all advocates
//-----------------------

exports.getAllAdvocates = async (req, res) => {
    try {
        const advocates = await Advocate.find();  // Fetch all advocates from the collection

        if (!advocates || advocates.length === 0) {
            return res.status(404).json({ success: false, message: 'No advocates found' });
        }

        res.status(200).json({ success: true, message: 'Advocates retrieved successfully by Admin', advocates });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

//Retrieving all Jr.advocates
//---------------------------

exports.getAllJrAdvocates = async (req, res) => {
    try {
        const jradvocates = await JrAdvocate.find();  // Fetch all jr.advocates from the collection

        if (!jradvocates || jradvocates.length === 0) {
            return res.status(404).json({ success: false, message: 'No jr.advocates found' });
        }

        res.status(200).json({ success: true, message: 'Jr.Advocates retrieved successfully by Admin', jradvocates });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

//Retrieving all Clients
//-----------------------

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();  // Fetch all clients from the collection

        if (!clients || clients.length === 0) {
            return res.status(404).json({ success: false, message: 'No clients found' });
        }

        res.status(200).json({ success: true, message: 'Clients retrieved successfully by Admin', clients });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

// Get all clients for a particular advocate by name
// -------------------------------------------------

exports.getClientsByAdvocate = async (req, res) => {
    try {
        const { advocateFirstName, advocateLastName } = req.body;

        // Validate required fields
        if (!advocateFirstName || !advocateLastName) {
            return res.status(400).json({ success: false, message: 'Advocate first name and last name are required' });
        }

        // Find all clients associated with the advocate
        const clients = await Client.find({ advocateFirstName, advocateLastName });

        // Check if any clients were found
        if (clients.length === 0) {
            return res.status(404).json({ success: false, message: `No clients found for the given Adv.${advocateFirstName} ${advocateLastName}` });
        }

        res.status(200).json({ success: true, message: `List of Clients retrieved successfully for Adv.${advocateFirstName} ${advocateLastName}`, clients })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

//Upadate A client By Admin (partial upadte)
//-------------------------------------------

exports.updateClientByAdmin = async (req, res) => {

    try {
        const { firstname, lastname } = req.params
        const updates = req.body

        if (!firstname || !lastname || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: 'First name, last name, and updates are required' })
        }

        const client = await Client.findOneAndUpdate(
            { firstname, lastname },
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!client) {
            return res.status(404).json({ success: false, message: `Client, ${firstname} ${lastname} not found.` })
        }

        res.status(200).json({ success: true, message: `Client, ${firstname} ${lastname} updated successfully`, client })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error })
    }
}

// Retriving All The Cases
//-------------------------

exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find();  // Fetch all cases from the collection

        if (!cases || cases.length === 0) {
            return res.status(404).json({ success: false, message: 'No cases found' })
        }
        res.status(200).json({ success: true, message: 'Successfully retriving all the cases', cases: cases })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error })
    }
}

//Retrieving all cases for a particular advocate by name
//---------------------------------------------------------

exports.getCasesByAdvocate = async (req, res) => {
    try {
        const { advocateFirstName, advocateLastName } = req.query; 

        // Validate required fields
        if (!advocateFirstName || !advocateLastName) {
            return res.status(400).json({ success: false, message: 'Advocate first name and last name are required' });
        }

        // Find the advocate by their first name and last name
        const advocate = await Advocate.findOne({ firstname: advocateFirstName, lastname: advocateLastName });

        // Check if the advocate exists
        if (!advocate) {
            return res.status(404).json({ success: false, message: `Advocate ${advocateFirstName} ${advocateLastName} not found` });
        }

        // Find all cases associated with the advocate's email
        const cases = await Case.find({ advocateEmail: advocate.email });

        // Check if any cases were found
        if (cases.length === 0) {
            return res.status(404).json({ success: false, message: `No cases found for Adv. ${advocateFirstName} ${advocateLastName}` });
        }

        // Return the cases
        res.status(200).json({ success: true, message: `List of cases retrieved successfully for Adv. ${advocateFirstName} ${advocateLastName}`, cases });
    } catch (error) {
        console.error('Error retrieving cases:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};


// Deleting Advocate
//------------------

exports.deleteAdvocate = async (req, res) => {
    try {
        const advocateId = req.params.id;

        // Validate that the client exists
        const advocate = await Advocate.findById(advocateId);
        if (!advocate) {
            return res.status(404).json({ success: false, message: 'Advocate not found' });
        }

        // Delete the client from the database
        await Advocate.findByIdAndDelete(advocateId);

        res.status(200).json({ success: true, message: 'Advocate deleted successfully', advocate: advocate })

    } catch (error) {
        console.error('Error deleting advocate:', error);
        res.status(500).json({ success: false, message: 'Server error', error })
    }
}

//Deleting Jr.Advicate
//--------------------

exports.deleteJrAdvocate = async (req, res) => {
    try {
        const JradvocateId = req.params.id;

        // Validate that the client exists
        const jrAdvocate = await JrAdvocate.findById(JradvocateId);
        if (!jrAdvocate) {
            return res.status(404).json({ success: false, message: 'Jr.advocate not found' });
        }

        // Delete the client from the database
        await JrAdvocate.findByIdAndDelete(JradvocateId);

        res.status(200).json({ success: true, message: 'Jr.advocate deleted successfully', jrAdvocate: jrAdvocate })

    } catch (error) {
        console.error('Error deleting Jr.advocate:', error);
        res.status(500).json({ success: false, message: 'Server error', error })
    }
}

//Deleting Client
//---------------

exports.deleteClient = async (req, res) => {
    try {
        const clientId = req.params.id;

        // Validate that the client exists
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        // Delete the client from the database
        await Client.findByIdAndDelete(clientId);

        res.status(200).json({ success: true, message: 'Client deleted successfully', client: client })

    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ success: false, message: 'Server error', error })
    }
}

//Approval For Advocates and Jr.Advocates 
//---------------------------------------

exports.updateAdvocateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { approvalStatus } = req.body;
    
            if (!["accepted", "rejected"].includes(approvalStatus)) {
                return res.status(400).json({ message: "Invalid status" });
            }
    
            if (approvalStatus === "accepted") {
                await Advocate.findByIdAndUpdate(id, { approvalStatus });
                return res.status(200).json({ message: "Advocate accepted successfully" });
            } 
    
            if (approvalStatus === "rejected")
            await Advocate.findByIdAndDelete(id);
            return res.status(200).json({ message: "Advocate rejected and removed from database" });
    
        } catch (error) {
            console.error("Error updating advocate status:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

//Retrieving Advoates and Jr. advocates with approal status pending
//-----------------------------------------------------------------

exports.getPendingAdvocates = async (req, res) => {
    try {
        // Fetch pending advocates and jr. advocates from both collections
        const advocates = await Advocate.find({ approvalStatus: "pending" });
        const jrAdvocates = await JrAdvocate.find({ approvalStatus: "pending" });

        const pendingAdvocates = [...advocates, ...jrAdvocates];

        if (pendingAdvocates.length === 0) {
            return res.status(404).json({ message: "No pending advocates found" });
        }

        res.status(200).json({ message: "Pending advocates fetched successfully", pendingAdvocates });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Getting Client By Client Name
//-----------------------------

exports.getClientByName = async (req, res) => {
    try {
        const { clientname } = req.query;

        if (!clientname) {
            return res.status(400).json({ success: false, message: 'Client name is required' });
        }

        // Find clients with case-insensitive search
        const clients = await Client.find({
            clientname: { $regex: new RegExp(clientname, 'i') }
        });

        if (clients.length === 0) {
            return res.status(404).json({ success: false, message: `No clients found with the name: ${clientname}` });
        }

        res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error('Error fetching client details by name:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

