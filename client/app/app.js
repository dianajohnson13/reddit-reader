angular.module('reader', [
  'reader.services',
  'reader.hot',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/hot/hot.html',
      controller: 'HotController'
    })
    .otherwise({redirectTo: '/'})
})