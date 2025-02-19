const Advocate = require('../Model/advocateModel')
const JrAdvocate = require('../Model/jrAdvocateModel')

// Get Advocates & Jr. Advocates by Specialization
//-----------------------------------------------------

exports.getAdvocatesBySpecialization = async (req, res) => {

    try {
        const { specialization } = req.query

        // Validate specialization input
        if (!specialization) {
            return res.status(400).json({ success: false, message: "Specialization is required." })
        }

        // Find advocates and jr. advocates by specialization
        const advocates = await Advocate.find({ specialization })
        const jrAdvocates = await JrAdvocate.find({ specialization })

        // Combine results
        const allAdvocates = [...advocates, ...jrAdvocates];

        if (allAdvocates.length === 0) {
            return res.status(404).json({ success: false, message: "No advocates found for this specialization." })
        }

        res.status(200).json({ success: true,message: `Advocated with '${specialization}' category is fetched Succesfully...`, advocates: allAdvocates })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error })
    }
}
