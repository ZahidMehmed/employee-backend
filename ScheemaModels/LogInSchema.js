const mongoose = require('mongoose')
const LogInSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        lowercase: true 
     },
     status: { type: String, default: 'Autherized' },
    password: String,
    Add: { type: Boolean, default: true },
    Delete: { type: Boolean, default: true },
    Update: { type: Boolean, default: true },
    leaveApprrove: { type: Boolean, default: true },
    EmpList: { type: Boolean, default: true },
    EmpLeaves: { type: Boolean, default: true },
    Events: { type: Boolean, default: true },
    Policy: { type: Boolean, default: true },
 })

module.exports = mongoose.model('SuperAdmin',  LogInSchema)