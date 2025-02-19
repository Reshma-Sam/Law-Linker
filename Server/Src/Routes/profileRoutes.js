const express = require('express')
const profileController = require('../Controllers/profileController')
const authenticateToken = require('../Middleware/authenticateToken')
const ownProfile = require('../Middleware/ownProfile')
const { upload } = require("../Config/cloudinary");

const router = express.Router()

// POST : Route for uploading profile picture for all users
//---------------------------------------------------
router.post('/upload-profile/:userType/:id',authenticateToken,upload.single("profilePicture"), profileController.uploadProfilePicture)
// GET : Route for getting all users profile view
//------------------------------------------------
router.get('/:userType/:id', authenticateToken,profileController.getProfile)
// GET : Route for getting all other users profile view
//------------------------------------------------
router.get('/other/:userType/:id',profileController.getOtherUserProfile)

module.exports = router
