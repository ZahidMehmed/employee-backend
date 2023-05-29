const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
app.use(`/Uploads`, express.static('../Uploads'))
const EmployeDataList = require('../ScheemaModels/EmployeeDataScheema')
const EmpAttend = require('../ScheemaModels/EmployeeAttendSchema')
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const { findOne } = require('../ScheemaModels/EmployeeDataScheema');
app.use(express.json())
app.use(cors())




const CronJob = require('cron').CronJob;

const moment = require('moment');

const job = new CronJob('0 30 05 * * 1-6', async () => { // Exclude Sunday by using 1-6 for day of the week
    try {  
        console.log('Cron job started');

        const employees = await EmployeDataList.find();
        console.log(`Found ${employees.length} employees`);
        
        for (const employee of employees) {
            const today = moment().format('YYYY-MM-DD'); // Get current date in YYYY-MM-DD format
            const attendanceRecord = await EmpAttend.findOne({
                // employeeId: employee._id,
                currentDate: today,
                checkInTime: { $ne: null },
                checkOutTime: { $ne: null },
            });
        
            if (!attendanceRecord) {
                const newAttendanceRecord = new EmpAttend({
                    employeeId: employee._id,
                    fullName: employee.fullName,
                    email: employee.email,
                    attendance: 'Absent (No check-in/out)',
                    currentDate: today
                });
        
                console.log(`Updating attendance status for employee ${employee.fullName}`);
                await newAttendanceRecord.save();
                console.log(`Attendance status updated for employee ${employee.fullName}`);
            }
        }
        console.log('Attendance status updated successfully');
    } catch (error) {
        console.error('Error while updating attendance status:', error);
    }
});

job.start();


const AttendRouterCheckIn = express.Router()
AttendRouterCheckIn.post('/', async (req, res) => {
    try {
        const { email, fullName, employeeId } = req.body;
     let   employee = new EmpAttend({ email, fullName, employeeId });
        const now = new Date();
        if (now.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 20).getTime()) {
            return res.send({ message: "Check-in time has not yet arrived" });
        }
        employee.checkInTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        employee.attendance = "Present";
        employee.currentDate = new Date().toISOString().split('T')[0]
        await employee.save();
        res.send({ message: "Attendance recorded successfully" });
    } catch (error) {
        console.log("error in uploading: "+error);
    }
});


const AttenRouterCheckOut = express.Router()
AttenRouterCheckOut.post('/', async (req, res) => {
    try {
        const { email, fullName, employeeId} = req.body;
   let     employee = await EmpAttend.findOne({ email, fullName, employeeId  })
        if (employee) {
            const now = new Date();
            if (now.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 25).getTime()) {
                return res.send({ message: "Check-out time has Expeired" });
            }
            employee.checkOutTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            employee.attendance = "Present";
            employee.currentDate = new Date().toISOString().split('T')[0]
            await employee.save();
            res.send({ message: "Attendance Check-Out successfully" });
        }
        else {
            res.send("Emp not found")
        }
    } catch (error) {
        console.log(error);
    }
});

const EmpAttendGetRouter  = express.Router()
EmpAttendGetRouter.get('/', async (req, resp) => {
    let result = await EmpAttend.find()
    if (result.length > 0) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No List Avalaibal" })
    }
})

const SearchRouter = express.Router()
SearchRouter.get("/:key", async (req, resp) => {
const    currentDate = new Date().toISOString().split('T')[0]
    let result = await EmpAttend.find(
        {
            "$or": [
                { currentDate: { $regex: req.params.key } },
            ]
        }
    );
    resp.send(result)
})
module.exports = { AttendRouterCheckIn, AttenRouterCheckOut, EmpAttendGetRouter, SearchRouter }