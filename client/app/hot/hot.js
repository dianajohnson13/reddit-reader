angular.module('reader.hot', [])

.controller('HotController', function ($scope, PostGetter) {
  $scope.data = {};

  $scope.getWhatsHot = function() {
    PostGetter.getWhatsHot().then(function(resp) {
      $scope.data.posts = resp.data
    });
  }();

});
