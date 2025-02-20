const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')
const Client = require('../Model/clientModel')
const Admin = require('../Model/adminModel')
const multer = require('multer')
const path = require('path')
const {upload, cloudinary} = require("../Config/cloudinary")


// Upload profile picture function for all users
//-----------------------------------------------

exports.uploadProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = req.user?.usertype;
        console.log("UserType:", userType, "ID:", id);

        let userModel;
        switch (userType) {
            case "advocate":
                userModel = Advocate;
                break;
            case "jr.advocate":
                userModel = JrAdvocate;
                break;
            case "client":
                userModel = Client;
                break;
            case "admin":
                userModel = Admin;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid user type" });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("Checking if file is received...");

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded!" });
        }
        console.log("Uploading to Cloudinary...");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile_pictures",
        });

        console.log("Upload Successful, Cloudinary URL:", result.secure_url);

        // Update user profile picture with Cloudinary URL
        user.profilePicture = result.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture,
            user,
        });

    } catch (error) {
        console.error("Upload Profile Picture Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get Users Profile
//-------------------

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = req.user?.usertype;
        console.log("getProfile:",userType)

        if (!id || id === "undefined") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        let userModel;
        if (userType === 'advocate') userModel = Advocate;
        else if (userType === 'jr.advocate') userModel = JrAdvocate;
        else if (userType === 'client') userModel = Client;
        else if (userType === "admin") userModel = Admin;
        else return res.status(400).json({ success: false, message: "Invalid user type" });

        console.log(`Fetching ${userType} with ID: ${id}`);

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: `${userType} not found` });

        res.status(200).json({ success: true, message: `Successfully fetched ${userType} profile`, user });
    } catch (error) {
        console.error("Error fetching Jr. Advocate profile:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
}

// Get Other Users Profile 
//------------------------

exports.getOtherUserProfile = async (req, res) => {
    try {
        const { id, userType } = req.params;
        // const userType = req.user?.usertype;
        console.log("getProfile:",userType)

        if (!id || id === "undefined") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        let userModel;
        if (userType === 'advocate') userModel = Advocate;
        else if (userType === 'jr.advocate') userModel = JrAdvocate;
        else if (userType === 'client') userModel = Client;
        else if (userType === "admin") userModel = Admin;
        else return res.status(400).json({ success: false, message: "Invalid user type" });

        console.log(`Fetching ${userType} with ID: ${id}`);

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: `${userType} not found` });

        res.status(200).json({ success: true, message: `Successfully fetched ${userType} profile`, user });
    } catch (error) {
        console.error("Error fetching Jr. Advocate profile:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
}

// Update User Profile
//----------------------

exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const usertype = req.user?.usertype;
        const updateData = req.body;

        // Prevent email from being updated
        if (updateData.email) {
            return res.status(400).json({ success: false, message: "Email cannot be updated" });
        }

        let userModel;
        switch (usertype) {
            case 'admin':
                userModel = Admin;
                break;
            case 'advocate':
                userModel = Advocate;
                break;
            case 'jr.advocate':
                userModel = JrAdvocate;
                break;
            case 'client':
                userModel = Client;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid user type" });
        }

        // Find the user by ID
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: `${usertype} not found` });
        }

        // Update password if provided, without hashing
        if (updateData.password) {
            user.password = updateData.password;
            user.confirmPassword = updateData.password;
        }

        // Update other fields except email and password
        Object.keys(updateData).forEach((key) => {
            if (key !== "email" && key !== "password" && key !== "confirmPassword") {
                user[key] = updateData[key];
            }
        });

        // Save updated profile
        await user.save();

        res.status(200).json({
            success: true,
            message: `${usertype} profile updated successfully`,
            user
        });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};







