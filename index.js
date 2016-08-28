var express = require('express');
var reddit = require('redwrap');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

app.listen(port);
console.log("Listening on port: " + port);

app.use(express.static(__dirname + '/client'));

/* ROUTES */

app.get('/api/hot', function(req, resp) {
  redditHandler.getWhatsHot(req, function( err, data, r) {
    redditHandler.handleResp(err, data, r, resp);
  });
});

app.get('/api/posts', function(req, resp) {
  redditHandler.getBySubreddit(req, function(err, data, r) {
    redditHandler.handleResp(err, data, r, resp);
  });
});

// Since we are using HTML5 mode we want to route all non server side
// routes back to angular's routing
app.get('/*', function(req, res) {
  res.sendFile('index.html', { root: __dirname + '/client'});
});

/* HANDLER OF INCOMING REQUESTS THAT WILL REQUIRE REDDIT */

var redditHandler = (function() {

  return {
    getWhatsHot: getWhatsHot,
    getBySubreddit: getBySubreddit,
    handleResp: handleResp
  };

  function getWhatsHot(req, respHandler) {
    var reqQuery = req.query;
    if (reqQuery.after === null) {
      reddit.list().hot().limit(25, respHandler);
    } else {
      reddit.list().hot().after(reqQuery.after).limit(25, respHandler);
    }
  }

  function getBySubreddit(req, respHandler) {
    var reqQuery = req.query;
    var requestedTopics = (typeof reqQuery.subreddit === "string") ? reqQuery.subreddit : reqQuery.subreddit.join("+")
    if (reqQuery.after === null) {
      reddit.r(requestedTopics, respHandler);
    } else {
      reddit.r(requestedTopics).after(reqQuery.after).limit(25, respHandler);
    }
  }

  function handleResp(err, data, r, resp){
    if (err || r.statusCode != 200) {
      console.log(err);
      resp.status(500).send("Error getting reddit subreddit posts: ", err);
    } else {
      var redditData = {
        posts: data["data"]["children"],
        after: data["data"]["after"]
      };
      resp.status(200).send(redditData);
    };
  }
})();