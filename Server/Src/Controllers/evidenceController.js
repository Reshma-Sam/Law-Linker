const Evidence = require('../Model/evidenceModel');
const path = require('path');
const upload = require('../Config/CloudinaryEvidence')


// Upload Evidence (Only Assigned Advocate)
//-----------------------------------------

exports.uploadEvidence = async (req, res) => {
    try {
        const { caseId } = req.params;
        const userId = req.user.id;
        const { filePath, description, evidenceType } = req.body;

        if (!filePath) {
            return res.status(400).json({ success: false, message: 'No file uploaded!' });
        }

        // Save to DB
        const newEvidence = new Evidence({
            caseId,
            uploadedBy: userId,
            evidenceType: evidenceType || "document",
            filePath, // Use filePath from Cloudinary
            description: description || "",
        });

        await newEvidence.save();

        res.status(201).json({ success: true, message: "Evidence uploaded successfully", evidence: newEvidence });

    } catch (error) {
        console.error("Upload Evidence Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
}

// Get All Evidence for a Case (Only Assigned Advocate)
//-----------------------------------------------------

exports.getEvidenceByCase = async (req, res) => {
    try {
        const { caseId } = req.params;
        const evidenceList = await Evidence.find({ caseId })

        if (evidenceList.length === 0) {
            return res.status(404).json({ success: false, message: "No evidence found for this case" })
        }

        res.status(200).json({ success: true, message: "Successesfully gets the evidence" , evidence: evidenceList })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error })
    }
};

// Deleting an evidence by id
//----------------------------

exports.deleteEvidence = async (req, res) => {
    const { evidenceId } = req.params;

    try {
        const evidence = await Evidence.findByIdAndDelete(evidenceId);
        if (!evidence) {
            return res.status(404).json({ message: 'Evidence not found' });
        }
        res.status(200).json({ message: 'Evidence deleted successfully' });
    } catch (error) {
        console.error('Error deleting evidence:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};