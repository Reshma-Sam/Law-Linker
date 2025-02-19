const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  casetitle: { type: String, required: true },

  category: {
    type: String,
    enum: [
      "Civil / Debt Matters", "Cheque Bounce", "Civil Litigation", "Consumer Court", 
      "Documentation", "Recovery", "Corporate Law", "Arbitration", "Banking / Finance", 
      "Startup", "Tax", "Trademark & Copyright", "Criminal / Property", 
      "Criminal Litigation", "Cyber Crime", "Landlord / Tenant", "Property", 
      "Revenue", "Personal / Family", "Child Custody", "Divorce", "Family Dispute", 
      "Labour & Service", "Medical Negligence", "Motor Accident", "Muslim Law", 
      "Wills / Trusts", "Others", "Armed Forces Tribunal", "Immigration", 
      "Insurance", "International Law", "Notary", "Property Redevelopment", "Supreme Court"
    ],
    required: true,
  },

  specialization: {
    type: String,
    enum: [
      "civil-debt", "cheque-bounce", "civil-litigation", "consumer-court", 
      "documentation", "recovery", "corporate-law", "arbitration", "banking-finance", 
      "startup", "tax", "trademark-copyright", "criminal-property", "criminal-litigation", 
      "cyber-crime", "landlord-tenant", "property", "revenue", "personal-family", 
      "child-custody", "divorce", "family-dispute", "labour-service", 
      "medical-negligence", "motor-accident", "muslim-law", "wills-trusts", 
      "others", "armed-forces", "immigration", "insurance", "international-law", 
      "notary", "property-redevelopment", "supreme-court"
    ],
    required: true,
  },
  advocatefirstname:{type:String, required:true},
  advocatelastname:{type:String, required:true},
  advocateEmail: { type: String, required: true },
  clientname: { type: String, required: true },
  clientemail:{type:String, required:true},
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
