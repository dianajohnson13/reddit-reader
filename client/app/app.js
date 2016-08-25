angular.module('reader', [
  'reader.services',
  'reader.subreddit',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/*', {
      templateUrl: 'app/subreddit/subreddit.html',
      controller: 'SubRedditController'
    })
    .otherwise({
      templateUrl: 'app/subreddit/subreddit.html',
      controller: 'SubRedditController'
    })
})