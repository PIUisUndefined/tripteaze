const request = require('request');
const moment = require('moment');

let token;

if (!process.env.EVENTBRITE) {
	const config = require('../config.js');
	token = config.token;
} else {
	token = process.env.EVENTBRITE;
}

let searchEvents = (query, city, fromDate, cb) => {
	let formattedDate = moment(fromDate).format('YYYY-MM-DD');
	let params = {
		url: `https://www.eventbriteapi.com/v3/events/search/?q=${query}&location.address=${city}&start_date.range_start=${formattedDate}T00:00:00&sort_by=date`,
		headers: {
			'Authorization': `Bearer ${token}`
		}
		//?expand=name/?token=${token}`
	};

	function callback(error, response, body) {
		if(!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			cb(null, info.events);
		} else {
			cb(error,null);
			console.log('api not working');
		}
	}


	request(params, callback);

}

module.exports.searchEvents = searchEvents;
