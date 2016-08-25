var express = require('express');
var reddit = require('redwrap');

var app = express();

var port = process.env.PORT || 8000;

app.listen(port);
console.log("Listening on port: " + port);

app.use(express.static(__dirname + '/client'));

app.get('/api/hot', function(req, res) {
  getHot(req, res)
});

function getHot(req, resp) {
  reddit.list('hot', function(err, data, r){
    if (err) {
      resp.status(500).send("Error getting reddit hot posts!");
    } else {
      resp.status(200).send(data["data"]["children"]);
    }
  });
}
