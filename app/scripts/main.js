angular.module('App.key', [])
	.factory('keyFactory', function() {
		var getKey = function(){
			var key = 'AIzaSyAq-uqUL0NgGwbfTbOfE5SMKnnWWjqOfCg';
			return key;
		}
		return {
			getKey: getKey
		}
	});