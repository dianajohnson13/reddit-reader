angular.module('reader.subreddit', [])

.controller('SubRedditController', function ($scope, PostGetter, $location) {
  $scope.data = {};
  $scope.data.subreddits = {};

  $scope.getWhatsHot = function() {
    console.log('getWhatsHot')
    PostGetter.getWhatsHot().then(function(resp) {
      $scope.data.posts = resp.data
      console.log($scope.data.posts)
    });
  };

  $scope.getSubreddits = function() {
    PostGetter.getSubreddits(Object.keys($scope.data.subreddits)).then(function(resp) {
      $scope.data.posts = resp.data;
      console.log($scope.data.posts)
    });
  };

  $scope.setSubredditsFromUrl = function(urlpath) {
    subreddits = urlpath.slice(1, urlpath.length).split("+");
    subreddits.forEach(function(topic) {
      $scope.data.subreddits[topic] = topic;
    })
  }

  $scope.directUrlPath = function() {
    urlpath = $location.path();
    console.log(urlpath)
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

  $scope.updatepath = function() {
    path = "/" + Object.keys($scope.data.subreddits).join("+");
    $location.path(path);
  }

  $scope.addTopic = function(newTopic) {
    $scope.data.subreddits[newTopic] = newTopic;
    $scope.updatepath();
  }

  $scope.removeTopic = function(oldTopic) {
    delete $scope.data.subreddits[oldTopic];
    $scope.updatepath();
  }

});
