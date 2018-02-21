const express = require('express');
const Users = require('./database-mongo/index.js'); // need to create /////////
const bcrypt = require('bcrypt-nodejs');
const app = express();

app.checkPassword = (users, userName, pw) => {
  let match = false;
  Users.forEach( user => {
    let unhashedPw = bcrypt.compareSync(pw, user.attributes.password)
    if (user.attributes.username === userName && unhashedPw) {
      match = true;
    }
  })
  return match;
}


app.post('/login', (req, res) =>{
  let userName = req.body.username
  let password = req.body.password

  Users.fetch().then((users) => {
    if (app.checkPassword(users, userName, password)) {
      req.session.loggedIn = true;
      res.end();
    } else {
      alert('Unmatching username and password');
      res.end();
    }
  })
})


app.get('/logout', (req, res) => {
   req.session.destroy((err) => {
     if (err) {
       throw err
     }
   })
   res.redirect(301, /* figured could redirect to*/ '/login' /*or'/homepage' */);
})
