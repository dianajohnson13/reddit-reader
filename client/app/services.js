angular.module('reader.services', [])

.factory('PostGetter', function ($http) {

  var getWhatsHot = function (after) {
    return $http({
      method: "GET",
      url: "/api/hot?after=" + after 
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getSubreddits = function (topics, after) {
    var topicsStr = topics.map(function(topic) {
      return "subreddit=" + topic;
    }).join("&");

    return $http({
      method: "GET",
      url: "/api/posts?" + topicsStr + "&after=" + after
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
