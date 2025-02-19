const mongoose = require('mongoose')
const masterSchema = require('./MasterModel')

const adminSchema = new mongoose.Schema ( {
    ...masterSchema.obj,  //Inherits masterSchema
    usertype : {type:String, default:'admin', required:true},
    firstname : {type:String, required:true},
    lastname : {type:String, required:true},
    mobile : {type: Number, required:true},
    email : {type:String, required:true, unique:true},
    username: {type:String, required:true},
    password : {type:String, required:true},
    confirmPassword : {type:String},
    profilePicture: { type: String, default: '' }
})

module.exports = mongoose.model ("Admin", adminSchema)