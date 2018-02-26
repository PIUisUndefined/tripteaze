const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('../database-mongo/index.js'); 
const eventbrite = require('../APIhelper/eventbrite.js');

const app = express();
app.use(bodyParser.json());

app.use(session({
	secret: 'shhhhh af',
	resave: false,
	saveUnitialized: true
}));

app.use(express.static(__dirname + '/../react-client/dist'));


/***********************************************************************/
/*                        login                                        */

app.checkPassword = (userName, pw, checkPw) => {
  let match = false;
	console.log('before brypt')
		let unhashedPw = bcrypt.compareSync(pw, checkPw)
		console.log('after bcrypt')
    if (unhashedPw) {
      match = true;
    }
		console.log('match', match)
  return match;
}

app.get('/login', (req, res) =>{
  let userName = req.query.username
	let password = req.query.password
	
  db.retrieveUserPassword(userName, (userPw) => {
		if (app.checkPassword(userName, password, userPw)) {
			console.log('hit in if')
			req.session.loggedIn = true;
			res.end();
		} else {
			console.log('Unmatching username and password');
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
	let username = req.body.username;
	let password = req.body.password;

	// Checks if the username already exists in the db
	db.userExists(username, (existingUser) => {
		// If the username already exists
		if (existingUser.length > 0) {
			// Redirect to the signup page
			res.redirect(200, '/trips');
		// Else if new user
		} else {
			// Hash the password
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					throw err;
				} else {
					// Store the new user/hash in the db
					db.addNewUser(username, hash);
				}
			})
		}
	})
});

// Creates new session after new user is added to the database
const createSession = (req, res, newUser) => {
	return req.session.regenerate(() => {
		req.session.user = newUser;
		// Redirects to trips page
		res.redirect('/trips');
	});
}

/*************************** TRIP STUFF ***************************/
app.get('/trips', (req, res) => {
	const type = req.query.search; // right now tailored for public trips but can be adapted for user trips as well
	if (type === 'public') {
		db.showAllPublicTrips(function(err, data) {
			if (err) {
				res.status(500).end(err);
			} else {
				res.status(200).json({trips: data})
			}
		})
	} else {
		res.status(500).end();
	}
});

app.post('/trips', (req, res) => {
	const user = (req.body.tripUser);
	const city = (req.body.tripCity);
	db.addNewTrip(user, city, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			console.log(data);
			res.status(200);
			res.status(200).json({ city: data.city });
		}
	});
})

/******************************** Search - Events *****************************/

app.post('/events', function (req, res) {
	//var eventQuery = req.body.query;
	console.log('heresbody',req.body);
	eventbrite.searchEvents('bollywood', (err, data) => {
		if(err) {
			res.sendStatus(500);
			console.log('error');
		} else {
			res.statusCode=201;
			data.forEach((event) => {
				console.log('heresdata', event.name.text);
			});
		}
		res.end();
	});

});


/****************************************************************************/
const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port 3000!');
});
