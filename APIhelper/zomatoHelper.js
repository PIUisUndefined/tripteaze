const request = require('request');

let key;

if (!process.env.ZOMATO) {
  const config = require('../config.js');
  key = config.zomatoKey;
} else {
  key = process.env.ZOMATO;
}

let searchForFoods = ( cityId, searchFood, cb ) => {

  let params = {
    url: `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${searchFood}&count=25`,
    headers: {
      'user-key': key
    }
  };

  const callback = (err, res, body) => {
    if (!err && res.statusCode === 200) {
      let temp = JSON.parse(body);
      cb(null, temp.restaurants);
    } else {
      cb(err, null);
      console.log('errrrrrrrr, ', err);
    }
  };

  request(params, callback);

};

let searchForCityId = (city, cb) => {

  let params = {
    url: `https://developers.zomato.com/api/v2.1/cities?q=${city}`,
    headers: {
      'user-key': key
    }
  };

  const callback = (err, res, body) => {
    if (!err && res.statusCode === 200) {
      let temp = JSON.parse(body);
      try {
        cb(null, temp.location_suggestions[0].id);
      } catch (e) {
        callback(e, null);
      }
    }
  };
  request(params, callback);
};

module.exports.searchForCityId = searchForCityId;
module.exports.searchForFoods = searchForFoods;
