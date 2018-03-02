var mongoose = require('mongoose');
const config = require('../config.js');

let uri;

if (!process.env.MONGODB_URI) {
  console.log('DEV')
  uri = config.mongo;
} else {
  console.log('PROCESS PICKED UP', process.env.MONGODB_URI)
  uri = process.env.MONGODB_URI;
}
//URI is stored either on heroku or local config file
console.log('heyyyyooooooo');
let Schema = mongoose.Schema;
mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function() {
  console.log(process.env.MONGODB_URI);
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

function toLower (v) {
  return v.toLowerCase();
}

var userSchema = Schema({
  id: Schema.Types.ObjectId,
  name: {type: String, set: toLower, index: true, required: [true, "can't be blank"]},
  password: String
});

var tripSchema = Schema({
  id: Schema.Types.ObjectId,
  city: String,
  tripFromDate: Date,
  tripToDate: Date,
  isPublic: {type: Boolean, default: false},
  isArchived: {type: Boolean, default: false},
  //need to make sure each trip has a reference user
  user: {type: Schema.Types.ObjectId, ref: 'User'}

});

var restaurantSchema = Schema({
  id: {type: Number, index: true},
  name: String,
  url: String,
  address: String,
  zip: Number,
  logo: String,
  //latitude and longitude coordinates are placed in 'location' property
  location: [{type: Number}],
  price: Number,
  //need to make sure each restaurant or event has a reference trip
  trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
});


var eventSchema = Schema({
  id: {type: Number, index: true},
  name: String,
  description: String,
  url: String,
  start_time: String,
  end_time: String,
  is_free: Boolean,
  organizer_id: Number,
  venue_id: Number,
  category_id: Number,
  logo: String,
  //need to make sure each restaurant or event has a reference trip
  trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
});

var User = mongoose.model('User', userSchema);
var Trip = mongoose.model('Trip', tripSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Event = mongoose.model('Event', eventSchema);

let addNewTrip = (username, city, fromDate, toDate, callback) => {
  User.findOne({name: username}, function (err, user) {
    if(err) {
      callback(err);
    }
    Trip.create({
      id: new mongoose.Types.ObjectId(),
      city: city,
      user: user.id,
      // Dates need to be in YYYY-MM-DD format
      tripFromDate: fromDate,
      tripToDate: toDate
    }, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  });
};

let addRestaurantToTrip = (food, username, city, callback) => {
  //first find corresponding user
  User.findOne({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
      callback(err);
    } else {
      console.log(user);
      Trip.findOne({user: user.id, city: city}, function (err, trip) {
        if(err) {
          console.log('error', err);
          callback(err);
        } else {
          console.log(trip.city, trip.id);
          Restaurant.findOneAndUpdate({ id: food.restaurant.id},
            {$set: {
              id: food.restaurant.id,
              name: food.restaurant.name,
              url: food.restaurant.url,
              logo: food.restaurant.featured_image,
              address: food.restaurant.location.address,
              zip: food.restaurant.location.zipcode,
              location: [food.restaurant.location.latitude, food.restaurant.location.longitude],
              price: food.restaurant.price_range,
              trip: trip.id
              }
            }, {upsert: true}, function(err) {
              if(err) {
                console.log('error: ', err);
                callback(err);
              } else {
                callback();
              }
            }
          );
        }
        //then add restaurant to database based on trip ID
      });
    }
    //then find corresponding trip based on city for selected user
  });
};

let addEventToTrip = (event, username, city, callback) => {
  //first find corresponding user
  User.findOne({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
      callback(err);
    }
    //then find corresponding trip based on city for selected user
    Trip.findOne({user: user.id, city: city}, function (err, trip) {
      if(err) {
        console.log('error', err);
        callback(err);
      }
      //then add event to database based on trip ID
      //need to look at eventbrite API for structure
      Event.findOneAndUpdate({id: event.id},
        {$set: {
          name: event.name.text,
          description: event.description.text,
          id: event.id,
          url: event.url,
          start_time: event.start.local,
          end_time: event.end.local,
          is_free: event.is_free,
          organizer_id: event.organizer_id,
          venue_id: event.venue_id,
          category_id: event.category_id,
          logo: event.logo.url,
          trip: trip.id
          }
        }, {upsert: true}, function(err) {
          if(err) {
            console.log('error: ', err);
            callback(err);
          } else {
            callback();
          }
        }
      );
    });
  });
};

//for signup page-takes in username and password and adds user info to database
//need to make sure usernames are unique in db
let addNewUser = (name, password) => {
  User.findOneAndUpdate({name: name},
    {$set: {
      id: new mongoose.Types.ObjectId(),
      name: name,
      password: password
      }
    }, {upsert: true},
    function(err) {
      if(err) {
        console.log('error: ', err);
      }
    }
  );
};

// checks if username already exists in the database and
// returns that user
let userExists = (username, cb) => {
  // checks database based on input username
  User.find({
    name: username
  }, (err, existingUser) => {
    if (err) {
      console.error('error in userExists: ', err);
    } else {
      // callback on the existing user if it exists
      cb(existingUser);
    }
  })
};

//for login page-take in username and retrieve password from db
//on server side, bcrypt will be used to compare user input password to stored db password
//if they match user will be logged in, otherwise error message
let retrieveUserPassword = (username, callback) => {
  User.find({name: username}, function(err, user) {
    // If the user exists in the database
    if (user.length > 0) {
      // Then run the callback on that user's password
      callback(null, user[0].password);
    } else {
      // Should probably send an alert or something...
      console.log('user does not exist');
      callback('user does not exist');
    }
  });
};


//for user page-display all existing trips for user after being logged in
let showUserTrips = (username, callback) => {
  //first find corresponding user
  User.findOne({name: username}, function (err, user) {
    if(err || user === null) {
      console.log('error: ', err);
      callback(err);

    } else {
      //then find all trips for selected user
      Trip.find({user: user.id}, function (err, trips) {
        if(err) {
          callback(err, null);
        } else {
          callback(null, trips);
        }
      });
    }
  });
};

let showTripEvents = (username, city, callback) => {
//first find corresponding user
  User.findOne({name: username}, function (err, user) {
    if(err || user === null) {
      console.log('error: ', err);
      callback(err);
    } else {
      //then find trip based on selected user and city
      Trip.findOne({user: user.id, city: city}, function (err, trip) {
        if(err || trip === null) {
          console.log('error', err);
          callback(err);
        } else {
          if(err) {
            callback(err, null);
          } else {
            getTripEvents(trip.id, callback);
          }
        }
      });
    }
  });
};

let showTripRestaurants = (username, city, callback) => {
  //first find corresponding user
  User.findOne({ name: username }, function (err, user) {
    if (err || user === null) {
      console.log('error: ', err);
      callback(err);
    } else {
      //then find trip based on selected user and city
      Trip.findOne({ user: user.id, city: city }, function (err, trip) {
        if (err || trip === null) {
          console.log('error', err);
          callback(err);
        } else {
          if (err) {
            callback(err, null);
          } else {
            getTripRestaurants(trip.id, callback);
          }
        }
      });
    }
  });
};


//allows user to update whether trip is public and/or archived
//assumes username and city are known to obtain corresponding trip and update
let modifyTripDetails = (makePublic, makeArchived, username, city, callback) => {
  //first find corresponding user
  User.findOne({name: username}, function (err, user) {
    if(err) {
      callback(err);
      console.log('error: ', err);
    }
    //then find corresponding trip based on city for selected user
    Trip.findOne({user: user.id, city: city}, function (err, trip) {
      if(err) {
        callback(err);
        console.log('error', err);
      }
      makePublic = makePublic || trip.isPublic;
      makeArchived = makeArchived || trip.isArchived;
      Trip.update({id: trip.id},
        {$set:
          {
            isPublic: makePublic,
            isArchived: makeArchived
          }
        }, function (err) {
          if(err) {
            callback(err);
            console.log('error: ', err);
          }
        }
      );
    });
  });
};

getTripEvents = (tripID, callback) => {
  Event.find({ trip: tripID }, function (err, events) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, events);
    }
  });
}

getTripRestaurants = (tripID, callback) => {
  Restaurant.find({ trip: tripID }, function (err, eatin) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, eatin);
    }
  });
}

//removal function assumes we know the ID of the restaurant, event,
//or trip that we are wanting to remove from the database
let remove = (modelType, ID, callback) => {
  if(modelType === 'restaurant') {
    Restaurant.remove( {id: ID}, function (err) {
      if(err) {
        console.log('error: ',err);
        callback(err)
      } else {
        callback()
      }
    });
  } else if (modelType === 'event') {
    Event.remove( {id: ID}, function (err) {
      if(err) {
        callback(err);
        console.log('error: ',err);
        callback(err)
      } else {
        callback()
      }
    });
  } else if (modelType === 'trip') {
    Trip.remove( {id: ID}, function (err) {
      if(err) {
        callback(err);
        console.log('error: ',err);
        callback(err)
      } else {
        callback()
      }
    });
  } else {
    console.log('must specify correct model type to remove');
    callback(err);
  }
};
//for home page-displays all existing public trips
let showAllPublicTrips = (callback) => {
  Trip.find({isPublic: true}, function(err, trips) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, trips);
    }
  });
};



module.exports.addNewTrip = addNewTrip;
module.exports.addRestaurantToTrip = addRestaurantToTrip;
module.exports.addEventToTrip = addEventToTrip;
module.exports.addNewUser = addNewUser;
module.exports.retrieveUserPassword = retrieveUserPassword;
module.exports.showUserTrips = showUserTrips;
module.exports.modifyTripDetails = modifyTripDetails;
module.exports.remove = remove;
module.exports.showAllPublicTrips = showAllPublicTrips;
module.exports.userExists = userExists;
module.exports.showTripEvents = showTripEvents;
module.exports.showTripRestaurants = showTripRestaurants;
module.exports.getTripRestaurants = getTripRestaurants;
module.exports.getTripEvents = getTripEvents;


// {restaurant: { 
//   R: { res_id: 16608481 },
//   apikey: '4c7506bb724adf55c75f64091cfc569e',
//   id: '16608481',
//   name: 'Old Woolstore',
//   url: 'https://www.zomato.com/kingston-se-sa/old-woolstore-kingston-se?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1',
//   location: {
//     address: '11 Hansen St Kingston Sa, Kingston SE',
//     locality: 'Kingston SE',
//     city: 'Kingston SE',
//     city_id: 1814,
//     latitude: '-36.8287500000',
//     longitude: '139.8503820000',
//     zipcode: '5275',
//     country_id: 14,
//     locality_verbose: 'Kingston SE, Kingston SE'
//     },
//   switch_to_order_menu: 0,
//   cuisines: 'Others',
//   average_cost_for_two: 30,
//   price_range: 3,
//   currency: '$',
//   offers: [],
//   thumb: '',
//   user_rating: {
//     aggregate_rating: '2.8',
//     rating_text: 'Average',
//     rating_color: 'FFBA00',
//     votes: '4'
//     }
//   }
// }