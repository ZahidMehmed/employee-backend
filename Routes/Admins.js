const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
const jwt = require('jsonwebtoken')
const jwtKey = 'ssvr'
const Admins = require('../ScheemaModels/AdminsScheema')
app.use(express.json())
app.use(cors())
const AdminsPostRouter = express.Router()
AdminsPostRouter.post('/', async (req, resp) => {
  try {
    const { fullName, email, password, conPassword, contact } = req.body

    let result = new Admins({ fullName, email, password, conPassword, contact });
    result = await result.save();
    resp.send(result)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
})
const AdminGetRouter = express.Router()
AdminGetRouter.get('/', async (req, res) => {
  try {
    const adminRequests = await Admins.find();
    res.send(adminRequests);
  } catch (err) {
    res.status(500).send(err);
  }
});
const PutPermissionRouter = express.Router()
PutPermissionRouter.put('/:id', async (req, res) => {
  const { Add, Update, Delete, leaveApprrove,  EmpList, EmpLeaves, Events,Policy } = req.body
  let admin = await Admins.findById(req.params.id);
  if (!admin) {
    return res.status(404).send('Employee not found');
  }
  try {
    const result = await Admins.findByIdAndUpdate(req.params.id,
      {
        Add,
        Update,
        Delete,
        leaveApprrove,
        EmpList,
        EmpLeaves,
        Events,
        Policy
      }, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating event");
  }
})

const AdminPermGetRouterById = express.Router()
AdminPermGetRouterById.get('/:id', async (req, res) => {
  try {
    const adminRequest = await Admins.findById(req.params.id);
    res.send(adminRequest);
  } catch (err) {
    res.status(500).send(err);
  }
});

const AdminsGetRouter = express.Router()
AdminsGetRouter.get('/', async (req, resp) => {
  let result = await Admins.find()
  if (result.length > 0) {
    resp.send(result)
  }
  else {
    resp.send({ result: "No Product Avalaibal" })
  }
})

const AdminloginRouter = express.Router()
AdminloginRouter.post('/', async (req, resp) => {
  if (req.body.password && req.body.email) {

    const user = await Admins.findOne(req.body).select('-password')
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: '24h' }, (err, token) => {
        if (err) {
          resp.send({ result: "no user Found" })
        }
        resp.send({ user, auth: token })
      })

    }
    else {
      resp.status(401).send({ message: 'Invalid email or password' });
    }
  }
  else {
    resp.status(401).send({ message: 'Invalid email or password' });
  }
})

module.exports = { AdminsPostRouter, AdminsGetRouter, AdminloginRouter, AdminPermGetRouterById, PutPermissionRouter }