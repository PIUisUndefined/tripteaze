const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('../database-mongo/index.js');
const eventbrite = require('../APIhelper/eventbrite.js');
const zomato = require('../APIhelper/zomatoHelper.js')


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
    let unhashedPw = bcrypt.compareSync(pw, checkPw);
    if (unhashedPw) {
      match = true;
    }
  return match;
}

app.get('/login', (req, res) =>{
  let userName = req.query.username
  let password = req.query.password

  db.retrieveUserPassword(userName, (userPw) => {
		if (app.checkPassword(userName, password, userPw)) {
			req.session.loggedIn = true;
			res.end()
		} else {
			console.log('Unmatching username and password')
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

	// Checks if the username already exists in the db
	db.userExists(username, (existingUser) => {
		// If the username already exists
		if (existingUser.length > 0) {
			console.log('Username already exists!');
			// Redirect to the signup page
			res.redirect(200, '/signup');
		// Else if new user
		} else {
			// Hash the password
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					console.error('Error in hash password: ', err);
					res.status(500).send(err);
				} else {
					// Store the new user/hash in the db
					db.addNewUser(username, hash);
					console.log(`User '${username}' added to database`);
					res.status(200).end()
				}
			});
		}
	});
});

// Creates new session after new user is added to the database
const createSession = (req, res, newUser) => {
	return req.session.regenerate(() => {
		req.session.user = newUser;
		// Redirects to home page
		res.redirect('/');
	});
}
/*************************** TRIP STUFF ***************************/
app.get('/trips', (req, res) => {
	const type = req.query.search; // right now tailored for public trips but can be adapted for user trips as well
	if (type === 'public') {
		db.showAllPublicTrips(function(err, data) {
			if (err  || !data) {
				res.status(500).end(err);
			} else {
				getTripsEvents(data, function (err, tripsEvents) {
					if (err) {
						res.status(500).end(err);
					} else {
						res.status(200).json({ trips: tripsEvents });
					}
				});
			}
		});
	} else {
		db.showUserTrips(type, function(err, data) {
			if (err || !data) {
				res.status(500).end(err);
			} else {
				getTripsEvents(data, function (err, fullTrips) {
					if (err) {
						res.status(500).end(err);
					} else {
						res.status(200).json({ trips: fullTrips });
					}
				});
			}
		});
	}
});

getTripsEvents = (trips, callback) => {
	let fullTrips = [];
	numFinished = 0;
	for (let i = 0; i < trips.length; i++) {
		fullTrips.push(Object.assign({}, {
			id : trips[i].id,
			city: trips[i].city,
			isArchived: trips[i].isArchived,
			isPublic: trips[i].isPublic,
			fromDate: trips[i].tripFromDate,
			toDate: trips[i].tripToDate
		}));

		const tripID = trips[i].id
		db.getTripEvents(tripID, function (err, events) {
			fullTrips[i].events = events;
			db.getTripRestaurants(tripID, function (err, food) {
				fullTrips[i].eatin = food;
				numFinished++;
				if (numFinished === trips.length) {
					callback(null, fullTrips);
				}
			});
		});
	}
}

app.post('/trips', (req, res) => {
	const user = (req.body.tripUser);
	const city = (req.body.tripCity);
	const fromDate = (req.body.tripFromDate);
	const toDate = (req.body.tripToDate);

	db.addNewTrip(user, city, fromDate, toDate, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(200);
			res.status(200).json({ city: data.city });
		}
	});
});

app.patch('/trips', (req, res) => {
	if (req.body.public !== undefined) {
		db.modifyTripDetails(req.body.public, null, req.body.user, req.body.tripCity, function(err, data) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(202).end();
			}
		})
	} else {
		db.remove('trip', req.body.tripID, function(err, data) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(202).end();
			}
		})
	}
});

/******************************** Search - Events *****************************/

app.post('/events', function (req, res) {
	const city = req.body.tripCity;
	const query = req.body.eventQuery;

	const fromDate = req.body.tripFromDate;

	eventbrite.searchEvents(query, city, fromDate, (err, data) => {

		if(err) {
			console.log('error', err);
			res.status(500).send(err);
		} else {
			res.status(200);
			res.status(200).json(data);
		}
	});
});

app.post('/events/remove', function (req, res) {
	console.log('event to be removed',req.body);
	db.remove('event', req.body.eventID, function(err) {
		if(err) {
			res.status(500).send(err);
		} else {
			res.status(200).end();
		}
	});
});

app.post('/events/add', function (req,res) {
	const event = req.body.tripEvent;
	const user = req.body.tripUser;
	const city = req.body.tripCity;

	db.addEventToTrip(event, user, city, function(err) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(201).end();
		}
	});
});

app.get('/events', (req, res) => {
	const user = req.query.tripUser;
	const city = req.query.tripCity;
	console.log('get events', req.query);
	db.showTripEvents(user, city, function(err, data) {
		if (err) {
			res.status(500).end(err);
		} else {
			res.status(200).json({ events: data });
		}
	});
});

/********************************* Search - Foods ***************************/

app.post('/foods', (req, res) => {
	let city =  req.body.tripCity;
	let searchFood = req.body.foodQuery;
	zomato.searchForCityId( city, ( err, data ) => {
		if (err) {
			res.status(500).end()
		} else {
			let cityId = data
			zomato.searchForFoods( cityId, searchFood, (err, result) => {
				if (err) {
					res.status(500).end();
					console.log('err')
				} else {
					res.status(200).json({foods: result})
				}
				res.end();
			})
		}
	});
});

app.post('/foods/remove', function (req, res) {
	console.log('food to be removed', req.body);
	db.remove('restaurant', req.body.foodID, function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).end();
		}
	});
});

app.post('/foods/add', function (req, res) {
	const food = req.body.tripFood;
	const user = req.body.tripUser;
	const city = req.body.tripCity;
	db.addRestaurantToTrip(food, user, city, function (err) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(201).end();
		}
	});
});

app.get('/foods', (req, res) => {
	const user = req.query.tripUser;
	const city = req.query.tripCity;
	db.showTripRestaurants(user, city, function (err, data) {
		if (err) {
			res.status(500).end(err);
		} else {
			res.status(200).json({ foods: data });
		}
	});
});

/****************************************************************************/
const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port 3000!');
});
