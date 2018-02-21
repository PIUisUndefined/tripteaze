const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('../database-mongo');
const session = require('express-session');
const User = require('../database-mongo/index.js'); // Check database file FILL_ME_IN_SON

const app = express();
app.use(bodyParser.json());

app.use(session({
	secret: 'shhhhh af',
	resave: false,
	saveUnitialized: true
}));

app.use(express.static(__dirname + '/../react-client/dist'));

app.checkPassword = (users, userName, pw) => {
  let match = false;
  db.forEach( user => {
    let unhashedPw = bcrypt.compareSync(pw, user.attributes.password)
    if (user.attributes.username === userName && unhashedPw) {
      match = true;
    }
  })
  return match;
}

app.get('/login', (req, res) =>{
	console.log(req.body, req.query, 'login')
  let userName = req.query.username
  let password = req.query.password

  db.fetch().then((users) => {
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

/*************************** SIGN UP STUFF ***************************/

// Sign up
app.post('/signup', (req, res) => {
	console.log(req.body, req.query, 'signup')
	let username = req.body.username;
	let password = req.body.password;

	// Creates new user
	new User({
		// Need to check db for new user model // FILL_ME_IN_SON
		username: username
	})
	.fetch()
	.then(user => {
		// If the user does not exist
		if (!user) {
			// Hash the password
			bcrypt.hash(password, null, null, (err, hash) => {
				if (err) {
					throw err;
				} else {
					// Store new username/hashed password in database
					// (username, hash) call function from db to store username and hash // FILL_ME_IN_SON
				}})
				.then(newUser => {
					// Creates new session for the user
					createSession(req, res, newUser);
				});
		} else {
			// If account already exists, redirect to signup page
			console.log('Account already exists!');
			res.redirect('/signup');
		}
	});
});

// Creates new session after new user is added to the database
const createSession = (req, res, newUser) => {
	return req.session.regenerate(() => {
		req.session.user = newUser;
		res.redirect('/'); // Where do we want to redirect? FILL_ME_IN_SON
	});
}

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port 3000!');
});
