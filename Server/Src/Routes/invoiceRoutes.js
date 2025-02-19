const express = require("express");
const invoiceController = require('../Controllers/invoiceControllers')
const authenticateToken = require('../Middleware/authenticateToken')


const router = express.Router();

//POST : Generating Invoice
//--------------------------
router.post("/generate-invoice", authenticateToken,invoiceController.generateInvoice)
//GET :  Fetch payment details using session_id
//----------------------------------------------
router.get("/details/:sessionId",invoiceController.fetchPaymentdetails)

module.exports = router;
