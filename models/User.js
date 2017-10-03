//User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: { type: Number },
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true }
})


const User = mongoose.model('User', UserSchema)

module.exports = User
