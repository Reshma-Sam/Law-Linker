const Case = require('../Model/caseModel'); // Import your Case model

const checkAdvocateAccess = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const userId = req.user.id; // Get logged-in user's ID (from authentication middleware)

        const caseData = await Case.findById(caseId);
        if (!caseData) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        // Check if the logged-in user is the assigned advocate
        if (caseData.assignedAdvocate.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Access denied. You are not the assigned advocate for this case.' });
        }

        next(); // Allow access if the user is the assigned advocate
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

module.exports = checkAdvocateAccess;
