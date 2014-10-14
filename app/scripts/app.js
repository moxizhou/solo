'use strict';
angular.module('App', [])

.controller('AppController', function ($scope, AppFactory) {

  var languages = {};

  // $scope.updateCountry = function(){
  //   var list = langs[selectedLanguage.selectedIndex];
  // };

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

        var source = AppFactory.source($scope.languages.select);
        var target = $scope.languages.output;
        console.log("final transcript", finalTranscript, "and source", source);
        
        AppFactory.translate(finalTranscript, source, target).then(function(data) {
        console.log(data)
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

  var source = function(input) {
    if (input === 'cmn-Hans-CN') {
      return "zh-CN";
    } else if (input === 'yue-Hant-HK' || input ==='ccmn-Hans-HK' || input ==='cmn-Hant-TW') {
      return "Zh-TW";
    } else {
      return input.slice(0,2);
    }
  };

  return {
    translate: translate,
    source: source
  };

})

// .factory('ButtonFactory', function($resource) {
//   return $resource('/app/langs.js');
// });





