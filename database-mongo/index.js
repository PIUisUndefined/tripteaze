var mongoose = require('mongoose');
//using URI stored on heroku or localhost
mongoose.connect(process.env.MONGODB_URI | 'mongodb://localhost/test');


var db = mongoose.connection;

db.on('error', function() {
  console.log(process.env.MONGODB_URI);
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  quantity: Number,
  description: String
});

var Item = mongoose.model('Item', itemSchema);

var selectAll = function(callback) {
  Item.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.selectAll = selectAll;