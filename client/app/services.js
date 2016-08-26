angular.module('reader.services', [])

.factory('PostGetter', function ($http) {

  var getWhatsHot = function (after) {
    return $http({
      method: 'POST',
      url: '/api/hot',
      data: {after: after}
    })
    .then(function (resp) {
      console.log(resp)
      return resp;
    });
  };

  var getSubreddits = function (topics, after) {
    return $http({
      method: 'POST',
      url: '/api/subreddits',
      data: {topics: topics, after: after}
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