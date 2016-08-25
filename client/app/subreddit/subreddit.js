angular.module('reader.subreddit', [])

.controller('SubRedditController', function ($scope, PostGetter, $location) {
  $scope.data = {};
  $scope.subreddits = [];

  $scope.getWhatsHot = function() {
    console.log('getWhatsHot')
    PostGetter.getWhatsHot().then(function(resp) {
      $scope.data.posts = resp.data
      console.log($scope.data.posts)
    });
  };

  $scope.getSubreddits = function(urlpath) {
    console.log('getSubreddits')
    $scope.subreddits = urlpath.slice(1, urlpath.length).split("+");

    PostGetter.getSubreddits($scope.subreddits).then(function(resp) {
      $scope.data.posts = resp.data;
      console.log($scope.data.posts)
    });
  };

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
        $scope.getSubreddits(urlpath);
    }
  }();

});
