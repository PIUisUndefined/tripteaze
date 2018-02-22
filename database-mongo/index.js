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
  name: {type: String, set: toLower, index: true},
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

let addNewTrip = (city, username) => {
  User.find({name: username}, function (err, user) {
    if(err) {
      console.log('error: ', err);
    }
    Trip.create({
      _id: new mongoose.Types.ObjectId(),
      city: city,
      user: user._id
    }, (err) => {
      if(err) {
        console.log('error: ', err);
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
    Trip.find({user: user._id, city: city}, function (err, trip) {
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
          trip: trip._id
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
      _id: new mongoose.Types.ObjectId(),
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

//for login page-take in username and retrieve password from db
//on server side, bcrypt will be used to compare user input password to stored db password
//if they match user will be logged in, otherwise error message
let retrieveUserPassword = (username, callback) => {
  User.find({name: username}, function(err, user) {
    if(err) {
      callback(err,null);
    } else {
      callback(null, user.password);
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
    Trip.find({user: user._id}, function (err, trips) {
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
      Trip.update({_id: trip._id},
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
    Trip.remove( {_id: ID}, function (err) {
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

module.exports.showAllPublicTrips = showAllPublicTrips;
//module.exports.saveRestaurant = saveRestaurant;