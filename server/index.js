const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mongo');

const app = express();

// /    <script type="text/javascript" src="bundle.js"></script>
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

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
