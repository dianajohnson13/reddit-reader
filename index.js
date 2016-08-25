var express = require('express');
var reddit = require('redwrap');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var port = process.env.PORT || 8000;

app.listen(port);
console.log("Listening on port: " + port);

app.use(express.static(__dirname + '/client'));

app.get('/api/hot', function(req, res) {
  getHot(req, res)
});

app.post('/api/subreddits', function(req, res) {
  getSubreddits(req, res);
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

function getSubreddits(req, resp) {
  requestedTopics = req.body.topics.join("+");
  reddit.r(requestedTopics, function(err, data, r){
    if (err) {
      resp.status(500).send("Error getting reddit hot posts: ", err);
    } else {
      resp.status(200).send(data["data"]["children"]);
    }
  });
}
