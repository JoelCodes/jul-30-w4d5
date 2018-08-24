const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

const usersDataHelper = require('./lib/users-data-helper');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/login', (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const {email, password} = req.body;
  usersDataHelper.authenticateUser(email, password)
    .then((foundUser) => {
      console.log(foundUser);
      if(foundUser){
        res.cookie('userId', foundUser.id);
      }
      res.redirect('/');
    });
});

app.listen(8080, () => {
  console.log('Listening on 8080');
});
