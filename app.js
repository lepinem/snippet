//app.js

const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const dal = require('./dal')
const mongoose = require('mongoose')
const MongoClient = require('mongodb')
const mongooseSession = require('mongoose-session')
const jwt = require('jsonwebtoken')
const { createToken, ensureAuthentication } = require('./helpers.js')
const bcrypt = require('bcryptjs')
const Snippet = require('./models/Snippet')
const User = require('./models/User')
mongoose.Promise = require('bluebird')

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'jammyjam',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null }
    // store: mongooseSession(mongoose)
  })
)

const authorize = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

//set endpoints
//////////////// HOME ///////////////////
app.get('/', (req, res) => {
  res.render('home')
})

///////////////  LOGIN //////////////////

app.post('/login', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login/creds', (req, res) => {
  User.findOne({ username: req.body.username }, 'username password', function (err, user, next) {
    if (err) return next(err)
    if (!user) {
      return res.status(401).send({ message: 'Wrong info' })
    }
    user.comparePassword(req.body.password, user.password, function ( err, isMatch ) {
      console.log('is match', isMatch)
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong info' })
      }
      let token = { token: createToken(user)};
      req.session.jwtToken = token;
      res.redirect('/admin');
    })
  })
})

/////////////  SECURE ///////////////////

app.get('/admin', (req, res) => {
  if (req.isAuthenticated) {
    const users = dal.getUsers()
    res.render('admin',{
      users: users,
      loggedUsr: req.session.usr })
  } else {
    res.redirect('/')
  }
})

/////////////  GUEST  ///////////////////

app.post('/guest', (req, res) => {
  res.redirect('/guest')
})

app.get('/guest', (req, res) => {
  res.render('guest')
})

//////////////  SNIPPETS  ///////////////

app.post('/snippets', (req, res) => {
  res.redirect('/snippets')
})

app.get('/snippets', (req, res) => {
  res.render('snippets')
})

///////////////  ADD SNIPPET  ///////////


app.get('/addSnippet', (req, res) => {
  res.render('addSnippet')
})

app.post('/addSnippet', (req, res) => {
  const title = req.body.title
  const snippet = req.body.snippet
  const notes = req.body.notes
  const language = req.body.language
  const tags = req.body.tags

  const addSnippet = new Snippet()
  addSnippet.title = title
  addSnippet.snippet = snippet
  addSnippet.notes = notes
  addSnippet.language = language
  addSnippet.tags = tags
  addSnippet
    .save()
    .then((snippet) => {
      res.redirect("/snippet")
    })
    .catch((error) => {
      console.log(error)
      res.render('addSnippet', {
        addSnippet: addSnippet,
        errors: error.errors
      })
    })
})

//////////////  REGISTER USER  /////////////////

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  dal.addUser(req.body).then((newUser) => {
    res.redirect('/admin')
  })
})

////////////////  FIND SNIPPET  ////////////////////////////

app.get('/findSnippet', (req, res) => {
  Snippet.findOne({
    _id: req.params.id
  })
  .then((snippet) => {
    res.render("snippet", {
      snippet: snippet
    })
  })
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

app.listen(3000);
console.log('Listening on http://localhost:3000');
