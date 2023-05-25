const mongoose = require('mongoose')
const EmpAttendScheema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeDataList' },
    fullName: String,
    email: String,
    currentDate: String,
    checkInTime: String,
    checkOutTime: String, 
    attendance: { type: String, default: "Absent" }
 })

module.exports = mongoose.model('EmployeAttedList', EmpAttendScheema)