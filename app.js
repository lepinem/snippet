//app.js

const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const dal = require('./dal');


app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(expressJWT({ secret: TOKEN_SECRET }).unless({ path: ['/login', '/', '/adduser']}))

app.use(
  session({
    secret: 'jammyjam',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null }
  })
)

app.use(function (req, res, next) {
  if (req.session.usr) {
    req.isAuthenticated = true
  } else {
    req.isAuthenticated = false
  }
  next()
})


//set endpoints


//public endpoint

app.get('/', (req, res) => {
  res.render('home', {isAuthenticated: req.isAuthenticated})
})

app.post('/login', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login/creds', (req, res) => {
  const sesh = req.session
  const foundUsr = dal.getUser(req.body.username)
  if (req.body.password === foundUsr.password) {
    sesh.usr = { name: foundUsr.name }
    res.redirect('/admin')
  } else {
    res.send('try again')
  }
})

app.get('/admin', function (req, res) {
  if (req.isAuthenticated) {
    const users = dal.getUsers()
    res.render('admin',{
      users: users,
      loggedUsr: req.session.usr })
  } else {
    res.redirect('/')
  }
})

app.post('/guest', (req, res) => {
  res.redirect('/guest')
})

app.get('/guest', (req, res) => {
  res.render('guest')
})


///////////////////////logout///////////////////////////////
app.post('/logout', (req, res) => {
  res.redirect('/logout')
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.render('logout')
})
////////////////////////////////////////////////////////////

app.listen(3001);
console.log('Listening on http://localhost:3001');
