const mongoose = require('mongoose');

// Define the payment schema
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User associated with the payment
  amount: { type: Number, required: true },  // Payment amount in INR
  paymentStatus: { type: String, required: true },  // Status of the payment (e.g., 'succeeded', 'failed')
  receiptEmail: { type: String, required: true },  // Email address where receipt is sent
  paymentMethod: { type: String, required: true },  // Method of payment (e.g., 'card', 'paypal')
  paymentId: { type: String, required: true },  // Unique ID for the payment (from Stripe or other gateway)
  recipientEmail: { type: String, required: true },  // NEW FIELD: Email of the person receiving the payment
  date: { type: Date, default: Date.now },  // Timestamp for the payment
});

// Create the Payment model based on the schema
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
