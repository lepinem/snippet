//dal.js
const Snippet = require('./models/Snippet')
const User = require('./models/User')





let userInfo = [
  {id: 1, name: 'Matt LePine', username: 'lepinem', password: 'boom-boom'},
  {id: 2, name: 'Laura LePine', username: 'lingenfelterl', password: 'mattIsTheBest'}
]

getUser = (usrname) => {
  const foundUser = userInfo.find(usr => usrname === usr.username)
  return foundUser
}

getUserPass = (usrpass) => {
  const foundPass = userInfo.find(usr => usrpass === usr.password)
  return foundPass
}

getUsers = () => {
  return userInfo
}

console.log(userInfo)


module.exports = { getUser, getUserPass, getUsers }
