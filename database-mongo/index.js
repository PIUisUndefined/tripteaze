var mongoose = require('mongoose');

//using URI stored on heroku or localhost
const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/test'

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
  //latitude and longitude coordinates are placed in 'location' property
  location: [{type: Number}],
  price: Number,
  //need to make sure each restaurant or event has a reference trip
  trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
});


var eventSchema = Schema({
  id: {type: Number, index: true},
  name: String,
  url: String,
  address: String,
  zip: Number,
    //latitude and longitude coordinates are placed in 'location' property
  location: [{type: Number}],
  price: Number,
  //need to make sure each restaurant or event has a reference trip
  trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
});

var User = mongoose.model('User', userSchema);
var Trip = mongoose.model('Trip', tripSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Event = mongoose.model('Event', eventSchema);

let addNewTrip = (username, city, callback) => {
  User.find({name: username}, function (err, user) {
    if(err) {
      callback(err);
    }
    Trip.create({
      id: new mongoose.Types.ObjectId(),
      city: city,
      user: user.id
    }, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  });
};

let addRestaurantToTrip = (restaurant, username, city) => {
  //first find corresponding user
  User.find({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
    }
    //then find corresponding trip based on city for selected user
    Trip.find({user: user.id, city: city}, function (err, trip) {
      if(err) {
        console.log('error', err);
      }
      //then add restaurant to database based on trip ID
      Restaurant.findOneAndUpdate({id: restaurant.id},
        {$set: {
          name: restaurant.name,
          id: restaurant.id,
          url: restaurant.url,
          address: restaurant.location.address,
          zip: restaurant.location.zipcode,
          location: [restaurant.location.latitude, restaurant.location.longitude],
          price: restaurant.price_range,
          trip: trip.id
          }
        }, {upsert: true}, function(err) {
          if(err) {
            console.log('error: ', err);
          }
        }
      );
    });
  });
};

let addEventToTrip = (event, username, city) => {
  //first find corresponding user
  User.find({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
    }
    //then find corresponding trip based on city for selected user
    Trip.find({user: user._id, city: city}, function (err, trip) {
      if(err) {
        console.log('error', err);
      }
      //then add event to database based on trip ID
      //need to look at eventbrite API for structure
      Event.findOneAndUpdate({id: event.id},
        {$set: {
          name: event.name,
          id: event.id,
          url: event.url,
          address: event.location.address,
          zip: event.location.zipcode,
          location: [event.location.latitude, event.location.longitude],
          price: event.price_range,
          trip: trip.id
          }
        }, {upsert: true}, function(err) {
          if(err) {
            console.log('error: ', err);
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
      console.log('user', existingUser);
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
    if(err) {
      throw err;
    } else {
      callback(user[0].password);
    }
  })
};


//for user page-display all existing trips for user after being logged in
let showUserTrips = (username, callback) => {
  //first find corresponding user
  User.find({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
    }
    //then find all trips for selected user
    Trip.find({user: user.id}, function (err, trips) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, trips);
      }
    });
  });
};


//allows user to update whether trip is public and/or archived
//assumes username and city are known to obtain corresponding trip and update
let modifyTripDetails = (makePublic, makeArchived, username, city) => {
  //first find corresponding user
  User.find({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
    }
    //then find corresponding trip based on city for selected user
    Trip.find({user: user._id, city: city}, function (err, trip) {
      if(err) {
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
            console.log('error: ', err);
          }
        }
      );
    });
  });
};

//removal function assumes we know the ID of the restaurant, event,
//or trip that we are wanting to remove from the database
let remove = (modelType, ID) => {
  if(modelType === 'restaurant') {
    Restaurant.remove( {id: ID}, function (err) {
      if(err) {
        console.log('error: ',err);
      }
    });
  } else if (modelType === 'event') {
    Event.remove( {id: ID}, function (err) {
      if(err) {
        console.log('error: ',err);
      }
    });
  } else if (modelType === 'trip') {
    Trip.remove( {id: ID}, function (err) {
      if(err) {
        console.log('error: ',err);
      }
    });
  } else {
    console.log('must specify correct model type to remove');
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


