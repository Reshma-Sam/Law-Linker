const Feedback = require('../Model/feedbackModel')
const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')
const Client = require('../Model/clientModel')

// Submit feedback
//----------------

exports.submitFeedback = async (req, res) => {
    try {
        const { userType, userId, rating, comment } = req.body;

        if (!userType || !userId) {
            return res.status(400).json({ success: false, message: "User type and ID are required." })
        }

        let userModel;
        if (userType === 'advocate') userModel = Advocate;
        else if (userType === 'jrAdvocate') userModel = JrAdvocate;
        else return res.status(400).json({ success: false, message: "Invalid user type." })

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." })
        }

        const feedback = new Feedback({
            client: req.user.id, // Assuming the client is authenticated
            [userType]: userId,
            rating,
            comment
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Feedback submitted successfully.", Feedback: feedback })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error })
    }
};

// Get feedback for a specific Advocate or Junior Advocate
//---------------------------------------------------------

exports.getFeedback = async (req, res) => {
    try {
        const { userType, id ,firstname, lastname } = req.params;

        if (!id || (userType !== 'advocate' && userType !== 'jrAdvocate')) {
            return res.status(400).json({ success: false, message: "Invalid user type or ID." });
        }

        const feedbacks = await Feedback.find({ [userType]: id }).populate('client', 'name');
        res.status(200).json({ success: true, message: `Successfully gets feedback of ${userType}`,feedbacks });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
