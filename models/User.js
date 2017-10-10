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

UserSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    next()
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash
      next()
    })
  })
})

AuthorSchema.methods.comparePassword = function(pwd, dbPass, done) {
  bcrypt.compare(pwd, dbPass, (err, isMatch) => {
    done(err, isMatch)
  })
}

const User = mongoose.model('User', UserSchema)

module.exports = User
