const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: function () {
  //     // If the user creates themselves (e.g., `advocate` or `client`), `createdBy` is not required.
  //     // If the user is created by another user (e.g., `admin` creates a client), it is required.
  //     return this.usertype !== 'advocate' && this.usertype !== 'client' && this.usertype !== 'jr.advocate'; 
  //   },
  //   ref: 'User', // Reference to a generic "User" model (if applicable)
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
  },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = masterSchema;


