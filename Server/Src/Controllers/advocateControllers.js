require('dotenv').config()
const mongoose = require('mongoose')
const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')
const Client = require('../Model/clientModel')
const Case = require('../Model/caseModel')
const Message = require('../Model/messageModel')
const Appointment = require('../Model/appoinmentModel')
const Task = require('../Model/taskModel')
const bcrypt = require('bcryptjs')

// Sign up for Advocate
// --------------------

exports.signUpAdvocate = async (req, res) => {
    try {
        const { usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password, confirmPassword, advocateemail } = req.body;

        // Validate required fields
        if (!usertype || !firstname || !lastname || !mobile || !email || !barcodenumber || !specialization || !state || !district || !username || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Password and confirm password should match' });
        }

        // Check if email or username already exists
        const existingAdvocate = await Advocate.findOne({ $or: [{ email }, { username }] });
        const existingJrAdvocate = await JrAdvocate.findOne({ $or: [{ email }, { username }] });
        if (existingAdvocate || existingJrAdvocate) {
            return res.status(400).json({ success: false, message: 'Advocate with this email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Advocate or Jr. Advocate
        if (usertype === 'advocate') {
            const advocate = new Advocate({
                usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password: hashedPassword, approvalStatus: "pending"
            });
            await advocate.save();
            return res.status(201).json({ success: true, message: 'Advocate registered successfully', user: advocate });
        }

        if (usertype === 'jr.advocate') {
            if (!advocateemail) {
                return res.status(400).json({ success: false, message: 'Advocate email is required for Jr. Advocate' });
            }
            const jrAdvocate = new JrAdvocate({
                usertype, firstname, lastname, mobile, email, barcodenumber, specialization, state, district, username, password: hashedPassword, advocateemail, approvalStatus: "pending"
            });
            await jrAdvocate.save();
            return res.status(201).json({ success: true, message: 'Jr. Advocate registered successfully', user: jrAdvocate });
        }

        return res.status(400).json({ success: false, message: 'Invalid user type' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
        console.error("Error in signUpAdvocate:", error);
    }
};


//Creating new cases 
//-------------------

exports.createCases = async (req, res) => {
    try {
        const { advocatefirstname, advocatelastname, usertype, casetitle, category, advocateEmail, specialization, clientname, clientemail, caseDescription, isActive } = req.body;
        // Validate required fields
        if (!advocatefirstname || !advocatelastname || !usertype || !casetitle || !category || !advocateEmail || !specialization || !clientname || !clientemail || !caseDescription) {
            return res.status(400).json({ success: false, message: "All required fields must be filled" });
        }

        // Checking whether the case exists
        const existingCase = await Case.findOne({ casetitle, clientname });
        if (existingCase) {
            return res.status(400).json({ success: false, message: "Case already exists" });
        }

        // Dynamically assign the model based on usertype
        let userModel;
        if (usertype === 'advocate') {
            userModel = Advocate;
        } else if (usertype === 'jr.advocate') {
            userModel = JrAdvocate;
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Check if the advocate exists
        const user = await userModel.findOne({ email: advocateEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "Advocate not found" });
        }

        // Check if the client exists
        const client = await Client.findOne({ email: clientemail });
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        // Ensure advocateEmail is an array before updating
        if (!Array.isArray(client.advocateEmail)) {
            client.advocateEmail = client.advocateEmail ? [client.advocateEmail] : [];
        }

        if (!client.advocateEmail.includes(advocateEmail)) {
            client.advocateEmail.push(advocateEmail);
            await client.save();
        }


        // Create and save the new case
        const newCase = new Case({
            advocatefirstname, advocatelastname, usertype, casetitle, category,
            clientname, clientemail, advocateEmail, caseDescription, specialization,
            isActive, approvalStatus: "pending", createdAt: new Date(), updatedAt: new Date()
        });

        await newCase.save();

        res.status(201).json({ success: true, message: "Case created successfully", case: newCase });
    } catch (error) {
        console.error("Error creating case:", error)
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


//Updating Case : Only corresponding advocate and jr.advocate can update their own case
//--------------------------------------------------------------------------------------

exports.updateCase = async (req, res) => {
    try {
        const { caseId } = req.params;  // Case ID from the route parameter
        const { casetitle, category, specialization, caseDescription, isActive } = req.body;
        const advocateEmail = req.user.email;  // Advocate email from authenticated user (assuming it's set in req.user)

        // Find the case by its ID
        const existingCase = await Case.findById(caseId);
        if (!existingCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }

        // Check if the logged-in advocate is the one assigned to the case
        if (existingCase.advocateEmail !== advocateEmail) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this case" });
        }

        // Update the case with new data, but only fields that are allowed to be updated
        existingCase.casetitle = casetitle || existingCase.casetitle;
        existingCase.category = category || existingCase.category;
        existingCase.specialization = specialization || existingCase.specialization;
        existingCase.caseDescription = caseDescription || existingCase.caseDescription;
        existingCase.isActive = isActive !== undefined ? isActive : existingCase.isActive;
        existingCase.updatedAt = new Date();  // Update the timestamp

        // Save the updated case
        await existingCase.save();

        res.status(200).json({ success: true, message: "Case updated successfully", case: existingCase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
}

//Getting Own Cases of an Advocate or Jr.Advocate
//-----------------------------------------------

exports.getOwnCases = async (req, res) => {
    try {
        const { email: loggedInEmail, usertype } = req.user; // Extract user details from the token

        // Check if the user is an advocate
        // if (usertype !== 'advocate' || usertype!==" jr.advocate") {
        //     return res.status(403).json({ success: false, message: 'Access denied: Only assigned advocates can access their cases'})
        // }

        // Retrieve all cases associated with the logged-in advocate's email
        const cases = await Case.find({ advocateEmail: loggedInEmail })

        // Check if any cases exist
        if (cases.length === 0) {
            return res.status(404).json({ success: false, message: `No cases found for advocate with email: ${loggedInEmail}` })
        }

        res.status(200).json({ success: true, message: `Cases retrieved successfully for advocate with email: ${loggedInEmail}`, cases: cases })
    } catch (error) {
        console.error('Error retrieving cases:', error)
        res.status(500).json({ success: false, message: 'Server error occurred while retrieving cases', error })
    }
}
// Deleteing own cases by advocate
//---------------------------------

exports.deleteOwnCase = async (req, res) => {
    const { caseId } = req.params;

    try {
        const caseToDelete = await Case.findById(caseId);
        if (!caseToDelete) {
            return res.status(404).json({ message: 'Case not found' });
        }

        await Case.deleteOne({ _id: caseId });
        console.log(' Case deleted:', caseId);
        res.status(200).json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error(' Error deleting case:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//Approval For Cases 
//-------------------

exports.caseApproval = async (req, res) => {
    try {
        const { caseId, status } = req.body;

        // Ensure the status is valid
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use 'accepted' or 'rejected'." })
        }

        // Find the case and update the approval status
        const updatedCase = await Case.findByIdAndUpdate(
            caseId,
            { approvalStatus: status },
            { new: true }  // Return the updated document
        );

        if (!updatedCase) {
            return res.status(404).json({ success: false, message: "Case not found." })
        }

        res.status(200).json({ success: true, message: `Case status updated to ${status}`, case: updatedCase })

    } catch (error) {
        console.error("Error updating case status:", error);
        res.status(500).json({ success: false, message: "Server error", error })
    }
};

//Getting Advocate First Name ad Last Name
//------------------------------------------

exports.getAdvocateFullname = async (req, res) => {

    const { email, usertype } = req.params;

    try {
        let userModel;

        // Dynamically assign the model based on usertype
        if (usertype === 'advocate') {
            userModel = Advocate;
        } else if (usertype === 'jr.advocate') {
            userModel = JrAdvocate;
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (user) {
            res.json({ firstname: user.firstname, lastname: user.lastname });
        } else {
            res.status(404).json({ message: `${usertype} not found` });
        }

    } catch (error) {
        console.error(`Error fetching ${usertype}:`, error);
        res.status(500).json({ message: 'Server error' });
    }

}

//Getting his own single case details 
//--------------------------------------

exports.getCaseDetails = async (req, res) => {
    try {
        const { caseId } = req.params;
        const caseDetails = await Case.findById(caseId);
        if (!caseDetails) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }
        res.status(200).json({ success: true, case: caseDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//Getting Client By Case Id
//--------------------------

exports.getClientByCaseId = async (req, res) => {
    const { caseId } = req.params;

    // Validate the caseId
    if (!caseId || !mongoose.Types.ObjectId.isValid(caseId)) {
        return res.status(400).json({ success: false, message: "Invalid case ID provided" });
    }

    try {
        const caseDetails = await Case.findById(caseId);
        if (!caseDetails) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        console.log(` Looking for client: ${caseDetails.clientname}, Advocate: ${caseDetails.advocateEmail}`);
        // Find the client using clientname and advocateEmail (case-insensitive)
        const client = await Client.findOne({
            clientname: { $regex: new RegExp(`^${caseDetails.clientname}$`, 'i') },
            advocateEmail: { $regex: new RegExp(`^${caseDetails.advocateEmail}$`, 'i') }
        });


        if (!client) {
            console.warn(" No client found for the given case details.")
            return res.status(404).json({ success: false, message: "Client not found for this case" });
        }

        console.log(" Client found:", client);
        res.status(200).json({ success: true, client });
    } catch (error) {
        console.error(' Error fetching client by case ID:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

// Get all clients for a given advocate
// ------------------------------------

exports.getClientsByAdvocate = async (req, res) => {
    const { advocateEmail } = req.params;

    try {
        // Find all clients where advocateEmail matches
        const clients = await Client.find({ advocateEmail });

        if (clients.length === 0) {
            return res.status(404).json({ success: false, message: 'No clients found for this advocate.' });
        }

        res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch clients.', error: error.message });
    }
};

//Retriving Messages Database
//---------------------------

exports.getMessagesForAdvocate = async (req, res) => {
    const { advocateEmail } = req.params;

    if (!advocateEmail) {
        return res.status(400).json({ message: "Advocate email is required" });
    }

    try {
        const messages = await Message.find({ advocateEmail }).sort({ createdAt: -1 });

        if (!messages.length) {
            return res.status(404).json({ message: "No messages found" });
        }

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Sending Reply To Corresponding Client
//----------------------------------------------

exports.sendReplyToClient = async (req, res) => {
    const { originalMessageId, replyMessage } = req.body; // Only requires message ID and reply

    if (!originalMessageId || !replyMessage) {
        return res.status(400).json({ message: "Original message ID and reply message are required" });
    }

    try {
        // Find the original client message using its ID
        const originalMessage = await Message.findById(originalMessageId);

        if (!originalMessage) {
            return res.status(404).json({ message: "Original message not found" });
        }

        // Extract caseId and clientEmail from the original message
        const { caseId, clientEmail } = originalMessage;

        // Create and save the reply
        const reply = new Message({
            caseId,
            advocateEmail: req.user.email, // Advocate sending the reply
            clientEmail,
            message: replyMessage,
            isReply: true, // Marks as a reply
            replyTo: originalMessage._id, // Links to the original message
        });

        await reply.save();

        // Fetch updated messages (client message + all replies)
        const updatedMessages = await Message.find({ caseId, clientEmail }).sort({ createdAt: 1 });

        res.status(201).json({
            message: "Reply sent successfully!",
            messages: updatedMessages,
        });
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Retrieving appointments for advocate
//--------------------------------------

exports.getAppointmentsForAdvocate = async (req, res) => {
    try {
        const advocateEmail = req.user.email; // Extract advocate email from JWT

        const appointments = await Appointment.find({ advocateEmail });

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Update Appointment status
//-------------------------

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Status should be "approved" or "rejected"

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ message: `Appointment ${status} successfully!` });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Listing Approved Appointments (future)
//--------------------------------------

exports.approvalList = async (req, res) => {
    try {
        const advocateEmail = req.user.email; // Extract from token
        const currentDateTime = new Date();

        // Fetch only future approved appointments
        const approvedAppointments = await Appointment.find({
            advocateEmail,
            status: "approved",
            $or: [
                { date: { $gt: currentDateTime.toISOString().split("T")[0] } }, // Future dates
                {
                    date: currentDateTime.toISOString().split("T")[0],
                    time: { $gt: currentDateTime.toISOString().split("T")[1].slice(0, 5) } // Future times on the same day
                }
            ]
        });

        res.json(approvedAppointments);
    } catch (error) {
        console.error("Error fetching approved appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Fetch junior advocates under a specific advocate
//-------------------------------------------------

exports.getJuniorAdvocatesByAdvocateEmail = async (req, res) => {
    try {
        const advocateEmail = req.user.email; // Get advocate email from middleware

        // Fetch only pending requests for the logged-in advocate
        const jrAdvocates = await JrAdvocate.find({
            advocateemail: advocateEmail,
            approvalStatus: 'pending'
        });

        res.json({ success: true, jrAdvocates });
    } catch (error) {
        console.error("Error fetching Jr. Advocate requests:", error);
        res.status(500).json({ success: false, message: "Failed to fetch Jr. Advocate requests" });
    }
    };
   
// Update Jr. Advocate Verification Status (Accept/Reject)
//--------------------------------------------------------

exports.updateJrAdvocateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // "accepted" or "rejected"

    try {
        const jrAdvocate = await JrAdvocate.findByIdAndUpdate(
            id,
            { approvalStatus: status },
            { new: true }
        );

        if (!jrAdvocate) {
            return res.status(404).json({ message: 'Jr. Advocate not found' });
        }

        res.status(200).json({ message: `Jr. Advocate ${status} successfully.`, jrAdvocate });
    } catch (error) {
        console.error('Error updating Jr. Advocate status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a task for a specific Jr. Advocate under the logged-in advocate
//------------------------------------------------------------------------

exports.allocateTask = async (req, res) => {
    const { title, description, jrAdvocateId, dueDate } = req.body;
    const advocateEmail = req.user.email;

    try {
        // Check if the Jr. Advocate belongs to the logged-in advocate
        const jrAdvocate = await JrAdvocate.findOne({ _id: jrAdvocateId, advocateemail: advocateEmail });

        if (!jrAdvocate) {
            return res.status(403).json({ message: 'You can only assign tasks to your own Jr. Advocates.' });
        }

        // Create the task
        const task = new Task({
            title,
            description,
            assignedTo: jrAdvocateId,
            assignedBy: req.user.id,
            dueDate,
        });

        await task.save();
        res.status(201).json({ message: 'Task allocated successfully!', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to allocate task.' });
    }
}

// Fetch tasks assigned by the logged-in advocate
//------------------------------------------------

exports.getTasksByAdvocate = async (req, res) => {
    const advocateEmail = req.user.email;

    try {
        // Find all Jr. Advocates under the logged-in advocate
        const jrAdvocates = await JrAdvocate.find({ advocateemail: advocateEmail }).select('_id');

        if (!jrAdvocates.length) {
            return res.status(404).json({ message: 'No Junior Advocates found under this advocate.' });
        }

        // Extract Jr. Advocate IDs
        const jrAdvocateIds = jrAdvocates.map(jr => jr._id);

        // Find tasks assigned by the logged-in advocate
        const tasks = await Task.find({ assignedTo: { $in: jrAdvocateIds } })
            .populate('assignedTo', 'firstname lastname email')
            .populate('assignedBy', 'email');

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks.' });
    }
};

//Deleting the task
//-----------------

exports.deleteTask = async (req ,res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task.' });
    }
}

//Updating the task
//-----------------

exports.editTask = async (req ,res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, dueDate }, { new: true });
        res.json({ message: 'Task updated successfully.', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task.' });
    }
}

//Fetching allocated task list of an Jr. advocate by senior advocate
//------------------------------------------------------------------

exports.getAllAllowcatedTasks = async (req ,res) => {

    try {
        const jrAdvocateId = req.user.id;  // Extract Jr. Advocate ID from token
        // console.log("Fetching tasks for Jr. Advocate ID:", jrAdvocateId);

        const tasks = await Task.find({ assignedTo: jrAdvocateId })
            .populate('assignedBy', 'firstname lastname')  // Shows who assigned the task
            .sort({ createdAt: -1 });  // Sort by newest first

        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully.',
            tasks
        });
    } catch (error) {
        console.error('Error fetching Jr. Advocate tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks for Jr. Advocate.' });
    }
}

//Update allocated task status by jradvocate
//------------------------------------------

exports.updateTaskStatus = async (req, res) => {
const { taskId } = req.params;
    const { status } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }  // Ensure the updated task is returned
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        res.status(200).json({ success: true, message: 'Task status updated successfully.', task: updatedTask });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ success: false, message: 'Failed to update task status.' });
    }
}



