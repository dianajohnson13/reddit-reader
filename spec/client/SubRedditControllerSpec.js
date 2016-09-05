describe('SubRedditController', function () {
  var $scope, $location, createController, $httpBackend, $injector;

  beforeEach(module('reader'));
  beforeEach(inject(function($injector, $rootScope, _$location_) {

    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = _$location_;
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('SubRedditController', {
        $scope: $scope
      });
    };

    testPath = function (reqUrl) {
      var data = {posts: [{}, {}, {}, {}], after: null}
      createController();
      $httpBackend.whenGET(reqUrl).respond(data);
      expect($scope.data.allow_next).toBe(false);
      $httpBackend.flush();
      expect($scope.data.posts).toEqual(data.posts);
      expect($scope.data.allow_next).toBe(true);
    };

  }));

  it('should get hot posts when path is "/" and save to $scope.data.posts', function () {
    testPath("/api/hot?after=null");
  });

  it('should get posts when path is "hot" and save to $scope.data.posts', function () {
    $location.path("/hot")
    testPath("/api/hot?after=null");
  });

  it('should get posts when path contains a single subreddit and save to $scope.data.posts', function () {
    $location.path("/sanfrancisco");
    testPath("/api/posts?subreddit=sanfrancisco&after=null");
  });

  it('should get posts when path contains multiple subreddits and save to $scope.data.posts', function () {
    $location.path("/sanfrancisco+donkey");
    testPath("/api/posts?subreddit=sanfrancisco&subreddit=donkey&after=null");
  });

  it('should update the path and subreddit list when subreddits are added', function() {
    var originalPath = $location.path();
    createController();
    $scope.addTopic("sanfrancisco");
    $scope.addTopic("goat");
    $scope.addTopic("donkey");
    expect(originalPath).not.toEqual($location.path());
    expect($location.path()).toEqual("/sanfrancisco+goat+donkey");
    expect($scope.data.subreddits).toEqual({sanfrancisco: "sanfrancisco", goat: "goat", donkey: "donkey"});
  });

  it('should update the path and subreddit list when subreddits are removed', function() {
    var originalPath = $location.path("/sanfrancisco+goat+donkey");
    createController();
    $scope.removeTopic("sanfrancisco");
    expect(originalPath).not.toEqual($location.path());
    expect($location.path()).toEqual("/goat+donkey");
    expect($scope.data.subreddits).toEqual({goat: "goat", donkey: "donkey"});
  })

});
