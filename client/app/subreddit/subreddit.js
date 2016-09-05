angular.module('reader.subreddit', [])

.controller('SubRedditController', function ($scope, PostGetter, $location, $timeout, FlashFactory) {
  $scope.data = {
    posts: [],
    after: null,
    allow_next: true
  };
  $scope.data.subreddits = {};
  $scope.data.alertMessages = FlashFactory.getAlertMessages();

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
      if (resp.data === "" || resp.data.posts.length === 0) {
        // if multiple subreddits were searched and no posts were found an empty string is returned as data
        // if a single subreddit was searched and no posts were found, the resp.data.posts array is empty
        $scope.flashAlert('addingSubreddits','danger', 'Woops! No posts found. Redirecting to hot posts.');
        $scope.data.subreddits = {};
        $scope.data.allow_next = true;
        $scope.updatepath();
      } else {
        $scope.data.after = resp.data.after;
        $scope.data.allow_next = true;
        $scope.data.posts = $scope.data.posts.concat(resp.data.posts);
      }
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
    
  };

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
    if (newTopic === undefined || newTopic === "" || newTopic === "null") {
      $scope.flashAlert('addingSubreddits','danger', 'Woops! That is not a valid subreddit.');
    } else if (newTopic.trim().search(/\W/g) > -1) {
      $scope.flashAlert('addingSubreddits','danger', 'Woops! Subreddits should not include spaces. Try '+ newTopic.replace(/ /g,''));
    } else {
      $scope.data.subreddits[newTopic] = newTopic.trim();
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

  $scope.httpToHttps = function(url) {
    return url.replace(/^http:/, 'https:');
  }

  $scope.flashAlert = function(category, type, message) {
    $scope.data.alertMessages[category][type] = FlashFactory.addAlert(category, type, message);
    
    $timeout(function() {
      $scope.data.alertMessages[category][type] = FlashFactory.removeAlert(category, type);
    }, 5000)
  }

  $scope.directUrlPath();

})
.factory('FlashFactory', function() {
    var alertMessages = { addingSubreddits: {danger: null} };

    return {
      getAlertMessages: function() {
        return alertMessages;
      },

      addAlert: function(category, type, message) {
        alertMessages[category][type] = message;
        return message;
      },

      removeAlert: function(category, type) {
        alertMessages[category][type] = null;
        return null;
      }
    }

})
