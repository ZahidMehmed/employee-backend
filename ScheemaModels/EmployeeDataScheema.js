const mongoose = require('mongoose')
const EmpDataSchema = new mongoose.Schema({
    proPhoto: String,
    fullName: String,
    email: {
        type: String,
        lowercase: true
    },
    password: String,
    CNIC: String,
    designation: String,
    salary: String,
    lastDegree: String,
    address: String,
    joiningDate: String,
})

module.exports = mongoose.model('EmployeDataList', EmpDataSchema)