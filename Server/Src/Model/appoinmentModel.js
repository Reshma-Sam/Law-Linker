const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    clientEmail: { type: String, required: true },
    clientName: { type: String},
    advocateEmail: { type: String, required: true },
    date: { type: String, required: true },  // Format: YYYY-MM-DD
    time: { type: String, required: true },  // Format: HH:MM AM/PM
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    subject: {type:String,  required:true},
    message: {type:String, required:true}
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
