const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  casetitle: { type: String, required: true },

  category: {
    type: String,
    enum: [
      "Civil / Debt Matters",
      "Corporate & Business",
      "Criminal / Property",
      "Personal & Family",
      "Labour & Service",
      "Intellectual Property",
      "Others"
    ],
    required: true,
  },

  specialization: {
    type: String,
    enum: [
      // Civil / Debt Matters
      "Civil Debt Recovery", "Cheque Bounce", "Civil Litigation", "Consumer Court", "Documentation", 
      // Corporate & Business
      "Corporate Law", "Arbitration", "Banking / Finance", "Startup", "Tax", 
      // Criminal / Property
      "Criminal Litigation", "Cyber Crime", "Landlord / Tenant", "Property", "Revenue", 
      // Personal & Family
      "Child Custody", "Divorce", "Family Dispute", "Muslim Law", "Wills / Trusts", 
      // Labour & Service
      "Labour Law", "Service Matters", "Medical Negligence", "Motor Accident", 
      // Intellectual Property
      "Trademark & Copyright", "Property Redevelopment", 
      // Others
      "Armed Forces Tribunal", "Immigration", "Insurance", "International Law", "Notary", 
      "Supreme Court", "Others"
    ],
    required: true,
  },

  advocatefirstname: { type: String, required: true },
  advocatelastname: { type: String, required: true },
  advocateEmail: { type: String, required: true },
  clientname: { type: String, required: true },
  clientemail: { type: String, required: true },
  caseDescription: { type: String, required: true },

  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },

  isActive: { type: Boolean, default: true },

  approvalStatus: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
});

module.exports = mongoose.model("Case", caseSchema);
