'use strict';
angular.module('App', [])

.controller('AppController', function ($scope, AppFactory) {
  
  $scope.results = {};

  $scope.playMe = function(){
    AppFactory.translate($scope.results.translate).then(function(data) {
      console.log(data)
      var msg = new SpeechSynthesisUtterance(data);
      msg.lang = "zh-CN";
      speechSynthesis.speak(msg);
    });

  $scope.voice = function() {
     var finalTranscript = '';
          var recognizing = false;
          var ignore_onend;

          if('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function(event) {
              recognizing = true;
              console.log("speaking");
            }

            recognition.onerror = function(event) {
              ignore_onend = true;
              console.log(event.error);
            }

            recognition.onend = function() {
              recognizing = false;
              if (ignore_onend) {
                return;
              }
              console.log("stopped")
            }

            recognition.onresult = function(event) {
              var interimTranscript = '';
              for (var i = event.resultIndex; i<event.results.length; i++) {
                if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
                } else {
                  interimTranscript += event.results[i][0].transcript;
                }
              }
              console.log(finalTranscript);
            }
          };

          
            if (recognizing) {
              recognition.stop();
              return;
            } 
            finalTranscript = '';
            recognition.lang = 'en-US';                
            recognition.start();
          
  }
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





