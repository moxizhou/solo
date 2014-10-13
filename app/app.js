'use strict';
angular.module('App', [])

.controller('AppController', function ($scope, AppFactory) {
  $scope.results = {};
  $scope.playMe = function(){
    AppFactory.translate($scope.results.translate).then(function(data) {
      new GoogleTTS().play(data, "zh-CN", function() {
        console.log("success");
      });
    });
  }
})

.factory('AppFactory', function ($http) {

  var translate = function(text) { //data response is json?
    var key = 'AIzaSyAq-uqUL0NgGwbfTbOfE5SMKnnWWjqOfCg';
    var test = encodeURIComponent(text);
    var source = 'en';
    var target = 'zh-CN'
    return $http.get('https://www.googleapis.com/language/translate/v2?key=' + key + '&q=' + text + '&source=' + source + '&target=' + target)
      .then(function(resp) {
        return resp.data.data.translations[0].translatedText;
      });
  };
  return {
    translate: translate
  };

});





