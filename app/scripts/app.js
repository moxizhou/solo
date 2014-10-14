'use strict';
angular.module('App', [])

.controller('AppController', function ($scope, AppFactory) {

  var languages = {};

  $scope.voice = function() {
    var finalTranscript = '';
    var recognizing = false;
    var ignore_onend;

    if('webkitSpeechRecognition' in window) {
      var recognition = new webkitSpeechRecognition();

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
        
        if ($scope.languages.select == 'cmn-Hans-CN') {
          var source = "zh-CN";
        } else if ($scope.languages.select === 'yue-Hant-HK' || 'ccmn-Hans-HK' || 'cmn-Hant-TW') {
          var source = "Zh-TW";
        } else {
          var source = $scope.languages.select.slice(0,2);
        }
        console.log("final transcript", finalTranscript, "and source", source);
        
        var target = $scope.languages.output;
        AppFactory.translate(finalTranscript, source, target).then(function(data) {
        var msg = new SpeechSynthesisUtterance(data);
        msg.lang = target;
        speechSynthesis.speak(msg);
        });
      }
    };

    if (recognizing) {
      recognition.stop();
      return;
    } 
    finalTranscript = '';
    recognition.lang = $scope.languages.select; 
    recognition.start();
  }
})

.factory('AppFactory', function ($http) {

  var translate = function(text, source, target) { 
    var key = 'AIzaSyAq-uqUL0NgGwbfTbOfE5SMKnnWWjqOfCg';
    var test = encodeURIComponent(text);
    return $http.get('https://www.googleapis.com/language/translate/v2?key=' + key + '&q=' + text + '&source=' + source + '&target=' + target)
      .then(function(resp) {
        return resp.data.data.translations[0].translatedText;
      });
  };

  return {
    translate: translate,
  };

});





