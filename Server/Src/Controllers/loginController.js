require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../Model/adminModel')
const Client = require('../Model/clientModel')
const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')

//Login for all users depends on Usertype
//---------------------------------------

exports.loginForAllUsertType = async (req, res) => {
    const { email, password, usertype } = req.body;

    if (!email || !password || !usertype) {
        return res.status(400).json({ message: 'Please provide email, password, and usertype' });
    }

    let Model;
    let emailField = 'email'; // Default to 'email' for regular login

    // Dynamically select the model based on the usertype
    if (usertype === 'admin') {
        Model = Admin;
    } else if (usertype === 'client') {
        Model = Client;
    } else if (usertype === 'advocate') {
        Model = Advocate;
    } else if (usertype === 'jr.advocate') {
        Model = JrAdvocate;
        emailField = 'email'; // For jr. advocates, we use 'email'
    } else {
        return res.status(400).json({ message: 'Invalid usertype' });
    }

    console.log(`Selected model: ${Model.modelName}, Usertype: ${usertype}`)

    try {
        // Check if the user exists based on the appropriate email field
        const user = await Model.findOne({ [emailField]: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                usertype: user.usertype,
                email: user[emailField],
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // Send response with token and user details
        let userResponse = {
            id: user._id,
            email: user[emailField],
            usertype: user.usertype,
        };

        if (usertype === 'client') {
            userResponse.clientname = user.clientname || 'N/A';
        } else {
            userResponse.firstname = user.firstname;
            userResponse.lastname = user.lastname;
        }

        return res.status(200).json({
            message: 'Login successful',
            token,
            email: user[emailField],
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
