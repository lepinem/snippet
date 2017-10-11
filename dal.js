//dal.js
const Snippet = require('./models/Snippet')
const User = require('./models/User')
const url = "mongodb://127.0.0.1:27017/snippet"
const mongoose = require('mongoose')
const MongoClient = require('mongodb')
mongoose.Promise = require("bluebird")
mongoose.connect(url, {useMongoClient: true})

getUser = (username) => {
  return User.find({'username': username})
}

getUserPass = (userpass) => {
  const foundPass = userInfo.find(user => userpass === user.password)
  return foundPass
}

getUsers = () => {
  return userInfo
}

addUser = (newUser) => {
  const user = new User(newUser)
  user.save(function(err){
    console.log(err)
  })
  return Promise.resolve('success')
}

module.exports = { getUser, getUserPass, getUsers, addUser }
