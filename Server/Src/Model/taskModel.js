
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'JrAdvocate', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Advocate', required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'completed',' active'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
