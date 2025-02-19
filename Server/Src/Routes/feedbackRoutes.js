const express = require('express');
const feedbackController = require('../Controllers/feedbackControllers');
const authenticateToken = require('../Middleware/authenticateToken');

const router = express.Router();

//POST: Submit feedback for Advocate or Junior Advocate
//------------------------------------------------------
router.post('/submit', authenticateToken, feedbackController.submitFeedback)

//GET: Retrieve feedback for a specific Advocate or Junior Advocate
//------------------------------------------------------------------
router.get('/:userType/:id', feedbackController.getFeedback)

module.exports = router;
