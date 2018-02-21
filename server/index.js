const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mongo');

const app = express();

app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/items', function (req, res) {
  db.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port 3000!');
});
