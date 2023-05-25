const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({
    SuperAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin' },
    fullName: String,
    email:{
        type: String,
        lowercase: true 
     }, 
    password: String, 
    coPassword: String,
    gender:String,
    contact:String,
    Add: { type: Boolean, default: true },
    Delete: { type: Boolean, default: true },
    Update: { type: Boolean, default: true },
    leaveApprrove: { type: Boolean, default: true },
    EmpList: { type: Boolean, default: true },
    EmpLeaves: { type: Boolean, default: true },
    Events: { type: Boolean, default: true },
    Policy: { type: Boolean, default: true },

 })

module.exports = mongoose.model('Admin',  AdminSchema)