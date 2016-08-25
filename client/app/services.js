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

  return {
    getWhatsHot: getWhatsHot
  };
})