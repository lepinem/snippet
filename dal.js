//dal.js
const Snippet = require('./models/Snippet')
const User = require('./models/User')
const url = "mongodb://127.0.0.1:27017/snippet"
const mongoose = require('mongoose')
const MongoClient = require('mongodb')
mongoose.Promise = require("bluebird")
mongoose.connect(url)

getUser = (username) => {
  const foundUser = userInfo.find(user => username === user.username)
  return foundUser
}

getUserPass = (userpass) => {
  const foundPass = userInfo.find(user => userpass === user.password)
  return foundPass
}

getUsers = () => {
  return userInfo
}

module.exports = { getUser, getUserPass, getUsers }
