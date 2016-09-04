describe('Routing', function () {
  var $route;
  beforeEach(angular.mock.module('reader'));

  beforeEach(inject(function($injector){
    $route = $injector.get('$route');
  }));

  it('Should have / route, template, and controller routing to app/subreddit/..', function () {
     expect($route.routes['/'].controller).toBe('SubRedditController');
     expect($route.routes['/'].templateUrl).toBe('app/subreddit/subreddit.html');
  });

  it('Should route /* to app/subreddit/.. template and controller', function () {
    // tests otherwise
     expect($route.routes[null].controller).toBe('SubRedditController');
     expect($route.routes[null].templateUrl).toBe('app/subreddit/subreddit.html');
  });

});
