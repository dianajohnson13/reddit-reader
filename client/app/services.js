angular.module('reader.services', [])

.factory('PostGetter', function ($http) {

  var getWhatsHot = function () {
    return $http({
      method: 'GET',
      url: '/api/hot',
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getSubreddits = function (topics) {
    return $http({
      method: 'POST',
      url: '/api/subreddits',
      data: {topics: topics}
    })
    .then(function (resp) {
      return resp;
    });
  };

  return {
    getWhatsHot: getWhatsHot,
    getSubreddits: getSubreddits
  };
})