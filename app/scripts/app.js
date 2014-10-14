'use strict';
angular.module('App', [])

.controller('AppController', function ($scope, AppFactory) {
  var languages = {};
  $scope.dialects = undefined;

  $scope.langs2 = [
 {name:'Afrikaans',       code:['af-ZA']},
 {name:'Bahasa Indonesia',code:['id-ID']},
 {name:'Bahasa Melayu',   code:['ms-MY']},
 {name:'Català',          code:['ca-ES']},
 {name:'Čeština',         code:['cs-CZ']},
 {name:'Deutsch',         code:['de-DE']},
 {name:'English',         code:['en-AU', 'Australia',
                                'en-CA', 'Canada',
                                'en-IN', 'India',
                                'en-NZ', 'New Zealand',
                                'en-ZA', 'South Africa',
                                'en-GB', 'United Kingdom',
                                'en-US', 'United States']},
 {name:'Español',         code: ['es-AR', 'Argentina',
                                'es-BO', 'Bolivia',
                                 'es-CL', 'Chile',
                                 'es-CO', 'Colombia',
                                 'es-CR', 'Costa Rica',
                                 'es-EC', 'Ecuador',
                                 'es-SV', 'El Salvador',
                                 'es-ES', 'España',
                                 'es-US', 'Estados Unidos',
                                 'es-GT', 'Guatemala',
                                 'es-HN', 'Honduras',
                                 'es-MX', 'México',
                                 'es-NI', 'Nicaragua',
                                 'es-PA', 'Panamá',
                                 'es-PY', 'Paraguay',
                                 'es-PE', 'Perú',
                                 'es-PR', 'Puerto Rico',
                                 'es-DO', 'República Dominicana',
                                 'es-UY', 'Uruguay',
                                 'es-VE', 'Venezuela']},
 {name:'Euskara',           code: ['eu-ES']},
 {name:'Français',          code: ['fr-FR']},
 {name:'Galego',            code: ['gl-ES']},
 {name:'Hrvatski',          code: ['hr_HR']},
 {name:'IsiZulu',           code: ['zu-ZA']},
 {name:'Íslenska',          code: ['is-IS']},
 {name:'Italiano',          code: ['it-IT', 'Italia',
                                  'it-CH', 'Svizzera']},
 {name:'Magyar',            code: ['hu-HU']},
 {name:'Nederlands',        code: ['nl-NL']},
 {name:'Norsk bokmål',      code: ['nb-NO']},
 {name:'Polski',            code: ['pl-PL']},
 {name:'Português',         code: ['pt-BR', 'Brasil',
                                  'pt-PT', 'Portugal']},
 {name:'Română',            code: ['ro-RO']},
 {name:'Slovenčina',        code: ['sk-SK']},
 {name:'Suomi',             code: ['fi-FI']},
 {name:'Svenska',           code: ['sv-SE']},
 {name:'Türkçe',            code: ['tr-TR']},
 {name:'български',         code: ['bg-BG']},
 {name:'Pусский',           code: ['ru-RU']},
 {name:'Српски',            code: ['sr-RS']},
 {name:'한국어',              code: ['ko-KR']},
 {name:'中文',               code: ['cmn-Hans-CN', '普通话 (中国大陆)',
                                  'cmn-Hans-HK', '普通话 (香港)',
                                  'cmn-Hant-TW', '中文 (台灣)',
                                  'yue-Hant-HK', '粵語 (香港)']},
 {name: '日本語',            code: ['ja-JP']},
 {name: 'Lingua latīna',    code: ['la']}
 ];

 $scope.updateCountry = function() {
    for (var i = 0; i < langs2.length ; i++) {
      if ($scope.languages.select.name === (langs2[i][0])) {
        var test = langs2[i].slice(1)
        $scope.dialects = test
        }
      }
  };

 $scope.outlangs = [
 {name:'Afrikaans',       code:'af'},
 {name:'Indonesian',      code:'id'},
 {name:'Bahasa Melayu',   code:'ms'},
 {name:'Català',          code:'ca'},
 {name:'Čeština',         code:'cs'},
 {name:'Deutsch',         code:'de'},
 {name:'English',         code:'en'},
 {name:'Spanish',         code:'es'}, 
 {name:'Euskara',         code:'eu'},
 {name:'French',          code:'fr'},
 {name:'Galego',          code:'gl'},
 {name:'Hrvatski',        code:'hr'},
 {name:'Italiano',        code:'it'},
 {name:'Magyar',          code:'hu'},
 {name:'Hindi',           code:'hi'},
 {name:'Nederlands',      code:'nl'},
 {name:'Polski',          code:'pl'},
 {name:'Português-Bra',   code:'pt'},
 {name:'Portugues-Por',   code:'pt'},
 {name:'Română',          code:'ro'},
 {name:'Slovenčina',      code:'sk'},
 {name:'Suomi',           code:'fi'},
 {name:'Svenska',         code:'sv'},
 {name:'Türkçe',          code:'tr'},
 {name:'български',       code:'bg'},
 {name:'Pусский',         code:'ru'},
 {name:'Српски',          code:'sr'},
 {name:'한국어',            code:'ko'},
 {name:'中文 (中国大陆)',   code:'zh-CN'},
 {name:'中文 (台灣)',       code:'zh-CN'},
 {name:'日本語',           code:'ja'},
 {name:'Lingua latīna',   code:'la'}
 ];

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

        var source = AppFactory.source($scope.languages.dialect[0]);
        var target = $scope.languages.output.code;
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
    recognition.lang = $scope.languages.dialect[0]; 
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
    console.log(input)
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








