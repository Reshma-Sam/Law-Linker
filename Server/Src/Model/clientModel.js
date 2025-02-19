const mongoose = require('mongoose')
const masterSchema = require('../Model/MasterModel')

const clientSchema = new mongoose.Schema ( {
    ...masterSchema.obj,
    usertype : {type:String, default: 'client',required:true },
    clientname : {type:String, required:true},
    mobile : {type: Number, required:true},
    email : {type:String, required:true, unique:true},
    state : {type:String, required:true},
    district: {type:String, required:true},
    username: {type:String, required:true},
    password : {type:String, required:true},
    confirmPassword : {type:String},
    advocateEmail : { type: [String], default: [] },
    profilePicture: { type: String, default: '' }

})

module.exports = mongoose.model ('Client', clientSchema)