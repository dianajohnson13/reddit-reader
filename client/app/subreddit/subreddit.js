angular.module('reader.subreddit', [])

.controller('SubRedditController', function ($scope, PostGetter, $location) {
  $scope.data = {
    posts: [],
    after: null,
    allow_next: true
  };
  $scope.data.subreddits = {};

  // added the allow_next lock here because the infinite scrolling was causing
  // a race condition between updating 'after' / adding new posts and the next
  // update from new scrolling.
  $scope.getPosts = function(type) {
    $scope.data.allow_next = false;
    var after = $scope.data.after;

    if (type === "hot") {
      PostGetter.getWhatsHot(after).then(handleNewPosts);
    } else if (type == "subreddits") {
      var topics = Object.keys($scope.data.subreddits);
      PostGetter.getSubreddits(topics, after).then(handleNewPosts);
    }
    
    function handleNewPosts(resp) {
      $scope.data.after = resp.data.after;
      $scope.data.allow_next = true;
      $scope.data.posts = $scope.data.posts.concat(resp.data.posts);
    };
  };

  $scope.setSubredditsFromUrl = function(urlpath) {
    var subreddits = urlpath.slice(1, urlpath.length).split("+");
    subreddits.forEach(function(topic) {
      $scope.data.subreddits[topic] = topic;
    })
  }

  $scope.directUrlPath = function() {
    $scope.data.posts = [];
    $scope.data.after = null;
    var urlpath = $location.path();

    switch (urlpath) {
      case "/":
        $scope.getPosts("hot");
        break;
      case "/hot":
        $scope.getPosts("hot");
        break;
      default:
        $scope.setSubredditsFromUrl(urlpath);
        $scope.getPosts("subreddits");
    }
    
  }();

  $scope.getMorePosts = function() {
    var numSubreddits = Object.keys($scope.data.subreddits).length;
    if (numSubreddits === 0 && $scope.data.allow_next) {
      $scope.getPosts("hot");
    } else if ($scope.data.allow_next) {
      $scope.getPosts("subreddits");
    }
  }

  $scope.updatepath = function() {
    var path = "/" + Object.keys($scope.data.subreddits).join("+");
    $location.path(path);
  }

  $scope.addTopic = function(newTopic) {
    if (newTopic !== undefined && newTopic !== "" && newTopic !== "null") {
      $scope.data.subreddits[newTopic] = newTopic;
      $scope.updatepath();
    }
  }

  $scope.removeTopic = function(oldTopic) {
    delete $scope.data.subreddits[oldTopic];
    $scope.updatepath();
  }

  $scope.relativeTime = function(timestamp) {
    var relTime = moment(timestamp, "X").fromNow();
    return relTime;
  }

  $scope.getCommmentsUrl = function(postData) { 
    return "https://www.reddit.com/r/"+postData.subreddit+"/comments/"+postData.id;
  }

  $scope.getAuthorUrl = function(postData) {
    return "https://www.reddit.com/user/"+postData.author;
  }

});
