angular.module('reader', [
  'reader.services',
  'reader.subreddit',
  'ngRoute',
  'infinite-scroll'
])
.config(function($routeProvider, $httpProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/subreddit/subreddit.html',
      controller: 'SubRedditController'
    })
    .otherwise({
      templateUrl: 'app/subreddit/subreddit.html',
      controller: 'SubRedditController'
    })

    $locationProvider.html5Mode(true);
})