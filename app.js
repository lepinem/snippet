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
    resave: true,
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

app.get('/', (req, res) => {
  res.render('home')
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

app.post('/guest', (req, res) => {
  res.redirect('/guest')
})

app.get('/guest', (req, res) => {
  res.render('guest')
})

app.post('/snippets', (req, res) => {
  res.redirect('/snippets')
})

app.get('/snippets', (req, res) => {
  res.render('snippets')
})

app.post('/addSnippet', (req, res) => {
  res.redirect('/addSnippet')
})

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

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password

  const addUser = new User()
  addUser.name = name
  addUser.email = email
  addUser.username = username
  addUser.passwordHash = bcrypt.hashSync(password, 8)
  addUser
    .save(addUser)
    .then((addUser) => {
      res.redirect('/admin')
    })
    .catch((error) => {
      res.render('register', {
        addUser: addUser,
        error: error.errors
      })
    })
})

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
