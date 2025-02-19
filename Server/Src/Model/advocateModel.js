const mongoose = require('mongoose');
const masterSchema = require('../Model/MasterModel');

const advocateSchema = new mongoose.Schema({
    ...masterSchema.obj,
    usertype: { type: String, enum: ['advocate', 'jr.advocate'],default: "advocate", required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    barcodenumber: { type: String, required: true },
    specialization: { type: String, enum: [
        'civil-debt', 'cheque-bounce', 'civil-litigation', 'consumer-court',
        'documentation', 'recovery', 'corporate-law', 'arbitration', 'banking-finance',
        'startup', 'tax', 'trademark-copyright', 'criminal-property', 'criminal-litigation',
        'cyber-crime', 'landlord-tenant', 'property', 'revenue', 'personal-family',
        'child-custody', 'divorce', 'family-dispute', 'labour-service',
        'medical-negligence', 'motor-accident', 'muslim-law', 'wills-trusts',
        'others', 'armed-forces', 'immigration', 'insurance', 'international-law',
        'notary', 'property-redevelopment', 'supreme-court'
    ], required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    approvalStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    profilePicture: { type: String, default: '' }
},
{ collection: 'advocates' });

module.exports = mongoose.model('Advocate', advocateSchema);
