const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    advocate: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Advocate', // Reference to the Advocate model
        required: function () { return !this.jrAdvocate; } // Required if jrAdvocate is not provided
    },
    jrAdvocate: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'JrAdvocate', // Reference to the JrAdvocate model
        required: function () { return !this.advocate; } // Required if advocate is not provided
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client', // Reference to the Client model
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
