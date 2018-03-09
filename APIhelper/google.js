const request = require('request');
const moment = require('moment');


let token;

if (!process.env.GOOGLE) {
  const config = require('../config.js');
  token = config.googleKey;
} else {
  token = process.env.GOOGLE;
}


let searchHotels = (/*query, */city,/* fromDate, toDate, */cb) => {

  let params = {
    url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${city}&key=${token}`,
    headers: {
      'key': `${token}`
    }
    //?expand=name/?token=${token}`
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      cb(null, info.results);
    } else {
      cb(error, null);
      console.log('hotel api not working');
    }
  }


  request(params, callback);

};

module.exports.searchHotels = searchHotels;
