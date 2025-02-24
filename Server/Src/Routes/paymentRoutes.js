const express = require('express')
const paymentController = require('../Controllers/paymentController')
const authenticateToken =require('../Middleware/authenticateToken')

const router = express.Router() 

// POST : Payment
//--------
router.post('/pay',authenticateToken, paymentController.payment)
//Webhook
//--------
router.post('/webhook',authenticateToken,paymentController.webhook)
//GET : Getting Payment History of Client
//---------------------------------------
router.get('/history',authenticateToken,paymentController.getPaymentHistory)
// GET : Getting payment history of a logged-in advocate
//------------------------------------------------------
router.get('/advocate/history',authenticateToken,paymentController.getPaymentReciepientHistory)

module.exports = router 