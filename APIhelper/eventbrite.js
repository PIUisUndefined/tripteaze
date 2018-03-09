const request = require('request');
const moment = require('moment');


let token;

if (!process.env.EVENTBRITE) {
  const config = require('../config.js');
  token = config.token;
} else {
  token = process.env.EVENTBRITE;
}


let searchEvents = (query, city, fromDate, toDate, cb) => {
  let formattedFromDate;
  let formattedToDate;

  if (fromDate.length <= 10 && toDate.length <= 10) {
    formattedFromDate = fromDate;
    formattedToDate = toDate;
  } else {
    formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    formattedToDate = moment(toDate).format('YYYY-MM-DD');
  }

  let params = {
    url: `https://www.eventbriteapi.com/v3/events/search/?q=${query}&location.address=${city}&start_date.range_start=${formattedFromDate}T00:00:00&start_date.range_end=${formattedToDate}T23:59:00&sort_by=date`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
    //?expand=name/?token=${token}`
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      cb(null, info.events);
    } else {
      cb(error,null);
      console.log('api not working');
    }
  }


  request(params, callback);

};

module.exports.searchEvents = searchEvents;
