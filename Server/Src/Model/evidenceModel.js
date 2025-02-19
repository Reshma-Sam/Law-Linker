const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case', // Reference to the Case model
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Advocate uploading the evidence
        required: true
    },
    evidenceType: {
        type: String,
        enum: ['document', 'image', 'video', 'audio', 'other'],
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
