//app.js

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const dal = require('./dal');
require('dotenv').config();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

app.use(cors());

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
  console.log(req.isAuthenticated, 'session')
  next()
})

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://lepine.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: '{Snippets!}',
  issuer: `https://lepine.auth0.com/`,
  algorithms: ['RS256']
});

//set endpoints

const checkScopes = jwtAuthz(['read:messages']);

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

//private endpoint
app.get('/api/private', checkJwt, checkScopes, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});


///////////////////////logout///////////////////////////////
app.post('/logout', (req, res) => {
  res.redirect('/logout')
})

app.get('/logout', function (req, res) {
  req.session.destroy()
  res.render('logout')
})
////////////////////////////////////////////////////////////

app.listen(3001);
console.log('Listening on http://localhost:3001');
