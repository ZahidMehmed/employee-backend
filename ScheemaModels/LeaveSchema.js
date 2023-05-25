const mongoose = require('mongoose')
const LeaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeDataList' },
    email:String,
    fullName: String,
    leaveFor: String,
    duration: Number,
    date: Date,
    fromDate: Date,
    toDate: Date,
    reason: String,
    applyDate: { type: String, default: Date.now },
    status: { type: String, default: 'pending' },
    numDays: Number
 })

module.exports = mongoose.model('Leaves',  LeaveSchema)