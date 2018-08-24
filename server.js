const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('req-flash');
app.use(cookieParser());

app.use(session({
  secret: 'I am an open book'
}));
app.use(flash({locals: 'flash'}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

const usersDataHelper = require('./lib/users-data-helper');

app.use((req, res, next) => {
  usersDataHelper
    .getUserById(req.cookies.userId)
    .then((user) => {
      res.locals.user = user;
      next();
    });
});

app.get('/', (req, res) => {
  console.log(req.flash());
  const flash = req.flash();
  if(flash.registerErrors){
    res.status(400);
  } else if(flash.loginError){
    res.status(401);
  }
  res.render('index');
});
app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  req.flash('person', 'David');
  res.redirect('/');
});

app.post('/login', (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const {email, password} = req.body;
  usersDataHelper.authenticateUser(email, password)
    .then((foundUser) => {
      if(foundUser){
        res.cookie('userId', foundUser.id);
        res.redirect('/');
      } else {
        req.flash('loginEmail', email);
        req.flash('loginError', true);
        res.redirect('/');
      }
    });
});

app.post('/register', (req, res) => {
  const {userName, email, password} = req.body;
  usersDataHelper.createUser(userName, email, password)
    .then((createdUser) => {
      res.cookie('userId', createdUser.id);
      res.redirect('/');
    })
    .catch((errors) => {
      req.flash('registerErrors', errors);
      req.flash('registerUserName', userName);
      req.flash('registerEmail', email);
      res.redirect('/');
      // res.render('index', {
      //   registerErrors: errors,
      //   registerUserName: userName,
      //   registerEmail: email
      // });
    });
});


app.listen(8080, () => {
  console.log('Listening on 8080');
});
