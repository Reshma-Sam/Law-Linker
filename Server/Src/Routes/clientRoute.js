const express = require('express')
const clientController = require('../Controllers/clientControllers')
const authenticateClient = require('../Middleware/authenticateClient')
const authenticateToken = require('../Middleware/authenticateToken')
const router = express.Router()

// POST : Sign up for Client
//--------------------------
router.post('/signupClient',clientController.signUpClient)
//POST : Booking Appoinment advocate
//--------------------------
router.post('/book-appointment',authenticateClient,authenticateToken,clientController.bookAppointment)
//GET : Retrieving own appointment requests
//-----------------------------------------
router.get('/appointment-list',authenticateToken,clientController.getClientAppointments)
//PUT : Update Appointment
//-------------------------
router.put('/appointment/:id',authenticateToken,clientController.updateAppointmentByClient)
//DELETE : Delete Appointment
//----------------------------
router.delete('/appointment/:id',authenticateToken,clientController.deleteAppointmentByClient)
//GET : Retrieving own cases
//--------------------------
router.get('/cases', authenticateClient,authenticateToken,clientController.getClientCases)
//POST : Sending message to corresponding case advocate 
//------------------------------------------------------
router.post('/send-message',authenticateClient,authenticateToken,clientController.sendMessageToAdvocate)


module.exports = router