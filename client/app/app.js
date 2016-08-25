angular.module('reader', [
  'reader.services',
  'reader.hot',
  'reader.subreddit',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/hot', {
      templateUrl: 'app/hot/hot.html',
      controller: 'HotController'
    })
    .when('/', {
      templateUrl: 'app/hot/hot.html',
      controller: 'HotController'
    })
    .otherwise({
      templateUrl: 'app/subreddit/subreddit.html',
      controller: 'SubRedditController'
    })
})