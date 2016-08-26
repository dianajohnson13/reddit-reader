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
  $scope.getWhatsHot = function() {
    $scope.data.allow_next = false;
    PostGetter.getWhatsHot($scope.data.after).then(function(resp) {
      $scope.data.after = resp.data.after;
      $scope.data.allow_next = true;
      $scope.data.posts = $scope.data.posts.concat(resp.data.posts);
    });
  };

  // please see comment above getWhatsHot .. this method should be more reuseable 
  $scope.getSubreddits = function() {
    $scope.data.allow_next = false;
    var topics = Object.keys($scope.data.subreddits);
    var after = $scope.data.after;
    PostGetter.getSubreddits(topics, after).then(function(resp) {
      $scope.data.after = resp.data.after;
      $scope.data.allow_next = true;
      $scope.data.posts = $scope.data.posts.concat(resp.data.posts);
    });
  };

  $scope.setSubredditsFromUrl = function(urlpath) {
    subreddits = urlpath.slice(1, urlpath.length).split("+");
    subreddits.forEach(function(topic) {
      $scope.data.subreddits[topic] = topic;
    })
  }

  $scope.directUrlPath = function() {
    $scope.data.posts = [];
    $scope.data.after = null;

    urlpath = $location.path();
    switch (urlpath) {
      case "/":
        $scope.getWhatsHot();
        break;
      case "/hot":
        $scope.getWhatsHot();
        break;
      default:
        $scope.setSubredditsFromUrl(urlpath);
        $scope.getSubreddits();
    }
  }();

  $scope.getMorePosts = function() {
    var numSubreddits = Object.keys($scope.data.subreddits).length;
    if (numSubreddits === 0 && $scope.data.allow_next) {
      $scope.getWhatsHot();
    } else if ($scope.data.allow_next) {
      $scope.getSubreddits();
    }
  }

  $scope.updatepath = function() {
    path = "/" + Object.keys($scope.data.subreddits).join("+");
    $location.path(path);
  }

  $scope.addTopic = function(newTopic) {
    if (typeof newTopic !== "undefined" && newTopic !== "") {
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

});
