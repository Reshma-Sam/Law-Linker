
const express = require('express')
const adminControllers=require('../Controllers/adminControllers')
const authenticateToken = require('../Middleware/authenticateToken')
const adminAccessOnly = require('../Middleware/adminAccessOnly')

const router = express.Router()   // importing router instance

// POST : Sign up for admin
//--------------------------
router.post('/signupAdmin',adminControllers.signUpAdmin)
// POST : Adding Advocate By Admin
//--------------------------------
router.post("/createAdvocate", authenticateToken,adminAccessOnly,adminControllers.createAdvocate)
// POST : Adding Client By Admin
//------------------------------
router.post('/createClient', authenticateToken,adminAccessOnly,adminControllers.createClient)
//POST : Adding Jr.Advocate by Admin
//----------------------------------
router.post('/createJrAdvocate',authenticateToken,adminAccessOnly,adminControllers.createJrAdvocate)
// GET : Retrieving All Admins
//----------------------------
router.get('/admins',authenticateToken,adminAccessOnly,adminControllers.getAllAdmin)
// GET : Retrieving All Advocates
//-------------------------------
router.get('/advocates',authenticateToken,adminAccessOnly,adminControllers.getAllAdvocates)
// GET : Retrieving All Jr.Advocates
//---------------------------------
router.get('/jrAdvocates',authenticateToken,adminAccessOnly,adminControllers.getAllJrAdvocates)
// GET : Retrieving All Clients
//-----------------------------
router.get('/clients',authenticateToken,adminAccessOnly,adminControllers.getAllClients)
// GET : Retrieving All Clients of a purticular Advocate
//------------------------------------------------------
router.get('/gelAllClientsOfAdvocate', authenticateToken,adminAccessOnly,adminControllers.getClientsByAdvocate)
//PUT : Update A Client By Its Name
//----------------------------------
router.put('/updateClientByName/:firstname/:lastname',authenticateToken,adminAccessOnly,adminControllers.updateClientByAdmin)
//GET : Retrieving All Cases
//--------------------------
router.get('/cases',authenticateToken,adminAccessOnly, adminControllers.getAllCases)
 //GET : Retrieving all clients for a particular advocate by name
 //---------------------------------------------------------------
 router.get('/getAllCasesOfAdvocate',authenticateToken,adminAccessOnly,adminControllers.getCasesByAdvocate)
 //DELETE : Deleting advocate by admin
 //------------------------------------
router.delete('/advocate/:id',authenticateToken,adminAccessOnly,adminControllers.deleteAdvocate)
 //DELETE : Deleting jr.advocate by admin
 //------------------------------------
 router.delete('/JrAdvocate/:id',authenticateToken,adminAccessOnly,adminControllers.deleteJrAdvocate)
 //DELETE : Deleting client by admin
 //---------------------------------
 router.delete('/client/:id',authenticateToken,adminAccessOnly,adminControllers.deleteClient)
//PUT : Approval Status 
//----------------------
router.put('/update-advocate-status/:id',authenticateToken,adminAccessOnly,adminControllers.updateAdvocateStatus)
//GET : Retieving Client By Clent name
//-------------------------------------
router.get('/getClientByName',authenticateToken,adminAccessOnly,adminControllers.getClientByName)
//GET : Retrieving Advocates and Jr. Advocates with Approval Status Pedning
//--------------------------------------------------------------------------
router.get('/pending-advocates',authenticateToken,adminAccessOnly,adminControllers.getPendingAdvocates)

module.exports =router
