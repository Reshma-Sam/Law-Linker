const express = require('express');
const evidenceController = require('../Controllers/evidenceController');
const authenticateToken = require('../Middleware/authenticateToken');
const checkAdvocateAccess = require('../Middleware/checkAdvocateAccess');
const {upload} = require('../Config/CloudinaryEvidence')

const router = express.Router();

// POST: Upload Evidence (Only Assigned Advocate)
//------------------------------------------------
router.post('/upload/:caseId', upload.single('file'),authenticateToken, checkAdvocateAccess, evidenceController.uploadEvidence);
// GET: Get All Evidence for a Case (Only Assigned Advocate)
//-----------------------------------------------------------
router.get('/:caseId', authenticateToken, checkAdvocateAccess, evidenceController.getEvidenceByCase);
//DELETE : Deleting Evidence By Id
//--------------------------------
router.delete('/:evidenceId',authenticateToken,checkAdvocateAccess,evidenceController.deleteEvidence)

module.exports = router;
