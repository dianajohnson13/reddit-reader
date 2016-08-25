angular.module('reader.subreddit', [])

.controller('SubRedditController', function ($scope, PostGetter, $location) {
  $scope.data = {};
  $scope.subreddits = []; 

  $scope.getSubreddits = function() {
    urlpath = $location.path();
    $scope.subreddits = urlpath.slice(1, urlpath.length).split("+");

    PostGetter.getSubreddits($scope.subreddits).then(function(resp) {
      $scope.data.posts = resp.data;
      console.log(resp.data)
    });
  }();

});
