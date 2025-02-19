const express = require ('express')
const advocateControllers = require('../Controllers/advocateControllers')
const advocateOnlyMiddleware = require('../Middleware/checkAdvocateAccess')
const authenticateToken = require('../Middleware/authenticateToken')
const authUpdateCase = require('../Middleware/authUpdateCase')

const router = express.Router()

// POST : Sign up for advocate
//----------------------------
router.post('/signup',advocateControllers.signUpAdvocate)
//POST : Creating Cases : Only advocates and junior advocates can create cases
//----------------------------------------------------------------------------
router.post('/createCase',authenticateToken,advocateOnlyMiddleware,advocateControllers.createCases)
//PUT : Update a case : Only corresponding advocate and jr.advocate can update their own case
//--------------------------------------------------------------------------------------------
router.put('/updateCase/:caseId',authUpdateCase,advocateControllers.updateCase)
//GET : Retrieving All Cases Of His(Advocate/Jr.Advocate) Own Client
//-------------------------------------------------------------------
router.get('/getCases',authenticateToken,advocateControllers.getOwnCases)
//DELETE : Deleteing own cases by advocate
//-----------------------------------------
router.delete('/deleteCase/:caseId',authUpdateCase,advocateControllers.deleteOwnCase)
//PUT : Approval For Cases 
//-------------------
router.put('/caseApproval',authUpdateCase,advocateControllers.caseApproval)
//GET : Getting Advocate  First Name ad Last Name
//-----------------------------------------------
router.get('/getAdvocateByEmail/:email/:usertype',advocateControllers.getAdvocateFullname)
//GET : Retrieving his own a single case
//--------------------------------------
router.get('/getcase/:caseId',authUpdateCase,advocateControllers.getCaseDetails)
//GET : Retriving Clinet from case id
//-----------------------------------
router.get('/getClientByCase/:caseId',authenticateToken,advocateControllers.getClientByCaseId)
//GET : Retrieving All Clients
//----------------------------
router.get('/clients/:advocateEmail',authenticateToken,advocateControllers.getClientsByAdvocate)
//GET : Retriving messages from database
//---------------------------------------
router.get("/messages/:advocateEmail", authenticateToken,advocateControllers.getMessagesForAdvocate)
//POST : Sending reply to client
//------------------------------
router.post("/reply", authenticateToken,advocateControllers.sendReplyToClient);
// GET : Retrieving send (reply) messages
//----------------------------------------
router.get('/messages/:advocateEmail',authenticateToken,advocateControllers.getMessagesForAdvocate)
//GET : Retrieving Appointments for advocate
//-------------------------------------------
router.get("/appointments", authenticateToken, advocateControllers.getAppointmentsForAdvocate);
//PATCH : Updating Appointment Status
//------------------------------------
router.patch("/appointment-status/:id", authenticateToken, advocateControllers.updateAppointmentStatus);
//Listing Approved Appointments (future)
//--------------------------------------
router.get('/approved-appointments', authenticateToken,advocateControllers.approvalList)

module.exports = router

