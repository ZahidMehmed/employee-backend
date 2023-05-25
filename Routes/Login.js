const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
const users = require('../ScheemaModels/LogInSchema')
app.use(express.json())
app.use(cors())

const jwt = require('jsonwebtoken')
const jwtKey = 'ssvr'
const UserPostRouter = express.Router()
UserPostRouter.post('/', async (req, resp) => {
  const { name, email, password, status, Add, Update,
     Delete, leaveApprrove,EmpList, EmpLeaves, Events,Policy } = req.body
  let result = new users({
    name,
    email,
    password,
    status,
    Add,
    Update,
    Delete,
    leaveApprrove,
    EmpList,
    EmpLeaves,
    Events,
    Policy
  })
  result = await result.save();
  result.toObject()
  delete result.password
  resp.send(result)

})

const loginPostRouter = express.Router()
loginPostRouter.post('/', async (req, resp) => {

  if (req.body.password && req.body.email) {

    const user = await users.findOne(req.body).select('-password')
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: '24h' }, (err, token) => {
        if (err) {
          resp.send({ result: "no user Found" })
        }
        resp.send({ user, auth: token })
      })
    }
    else {
      resp.status(401).send({ message: 'Invalid email or password' })
    }
  }
  else {
    resp.status(401).send({ message: 'Invalid email or password' });
  }
})

const UserGetRouterById = express.Router()
UserGetRouterById.get('/:id', async (req, res) => {
  try {
    const usersRequest = await users.findById(req.params.id);
    res.send(usersRequest);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = { UserPostRouter, loginPostRouter, UserGetRouterById }