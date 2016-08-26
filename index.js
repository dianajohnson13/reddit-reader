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

app.post('/api/hot', function(req, res) {
  getHot(req, res)
});

app.post('/api/subreddits', function(req, res) {
  getSubreddits(req, res);
});

function getHot(req, resp) {
  if (req.body.after === null) {
    reddit.list().hot().limit(25, handleRedditResp)
  } else {
    reddit.list().hot().after(req.body.after).limit(25, handleRedditResp)
  }

  function handleRedditResp(err, data, r){
    if (err) {
      console.log(err)
      resp.status(500).send("Error getting reddit hot posts: ", err);
    } else {
      redditData = {
        posts: data["data"]["children"],
        after: data["data"]["after"]
      }
      resp.status(200).send(redditData);
    };
  }
}

function getSubreddits(req, resp) {
  requestedTopics = req.body.topics.join("+");
  if (req.body.after === null) {
    reddit.r(requestedTopics, handleRedditResp)
  } else {
    reddit.r(requestedTopics).after(req.body.after).limit(25, handleRedditResp)
  }

  function handleRedditResp(err, data, r){
    if (err) {
      console.log(err)
      resp.status(500).send("Error getting reddit subreddit posts: ", err);
    } else {
      redditData = {
        posts: data["data"]["children"],
        after: data["data"]["after"]
      }
      resp.status(200).send(redditData);
    };
  }
}
