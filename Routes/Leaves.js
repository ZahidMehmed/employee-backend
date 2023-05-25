const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
const Leave = require('../ScheemaModels/LeaveSchema')
const path = require('path');
const fs = require('fs');
const { findOne } = require('../ScheemaModels/EmployeeDataScheema');
app.use(express.json())
app.use(cors())

const LeavePostRouter = express.Router()
LeavePostRouter.post('/', async (req, res) => {
    const {email, fullName, leaveFor, duration, date, fromDate, toDate, reason } = req.body;
  
    let leaveRequest = new Leave({
      email, 
      fullName,
      leaveFor,
      duration,
      date,
      fromDate,
      toDate,
      reason
    });
  
     leaveRequest = await leaveRequest.save();
      res.send(leaveRequest);
   
  });



  const LeaveGetRouter  = express.Router()
  LeaveGetRouter.get('/', async (req, res) => {
    try {
      const leaveRequests = await Leave.find();
      res.send(leaveRequests);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  const LeaveGetRouterById = express.Router()
  LeaveGetRouterById.get('/:id', async (req, res) => {
    try {
      const leaveRequest = await Leave.findById(req.params.id);
      res.send(leaveRequest);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  const LeavePutRouter = express.Router()
  LeavePutRouter.put('/:id/:status', async (req, res) => {
    try {
      const leaveRequest = await Leave.findById(req.params.id);
  
      if (req.params.status === 'Approved') {
        leaveRequest.status = 'Approved';
      } else if (req.params.status === 'Rejected') {
        leaveRequest.status = 'Rejected';
      } else {
        res.status(400).send('Invalid status');
        return;
      }
  
      const updatedLeaveRequest = await leaveRequest.save();
      res.send(updatedLeaveRequest);
    } catch (err) {
      res.status(500).send(err);
    }
  });

const GetLeaveIdRouter = express.Router();
GetLeaveIdRouter.get('/:id', async(req, res)=>{
  try {
      
      let result = await Leave.findOne({_id: req.params.id });
      if (result) {
          res.send(result)
      }
      else {
          res.send("No result found")
      }
  } catch (error) {
        
  }
})
const LeaveDeleteRouter = express.Router()
  LeaveDeleteRouter.delete('/:id', async (req, res) => {
    try {
      const deletedLeaveRequest = await Leave.findByIdAndDelete(req.params.id);
      res.send(deletedLeaveRequest);
    } catch (err) {
      res.status(500).send(err);
    }
  });


  module.exports = {LeavePostRouter, LeaveGetRouter, LeaveGetRouterById, LeavePutRouter, LeaveDeleteRouter,GetLeaveIdRouter }