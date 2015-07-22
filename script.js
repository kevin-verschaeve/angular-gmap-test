angular.module('services', []).factory('myService', function () {

	 var service_map = {
		center: { latitude: 10, longitude: 12},
		zoom: 8
	};

	var getMap = function() {
		return service_map;
	}

	var setMap = function(map) {
		service_map = map;
	}

	return {
		getMap: getMap,
		setMap: setMap
	}
});

var app = angular.module('myApplicationModule', ['uiGmapgoogle-maps', 'services']);

var controller = app.controller('myCtrl', function($scope, myService) {
	var map = myService.getMap();

	$scope.map = { center: map.center, zoom: map.zoom };
	$scope.chosenPlace = '';

	$scope.viewMap = function() {
		console.log(myService.getMap());
	};

	$scope.isEmpty = function(value) {
		return (typeof value == "undefined" || value == "" || value == 0 || value == false);
	};

	$scope.getAndApplyMap = function() {
		if ($scope.isEmpty($scope.chosenPlace)) {
			return;
		}

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({address: $scope.chosenPlace}, function(results, status) {

			if (results.length < 1) {
				return;
			}

			latitude = results[0].geometry.location.lat();
			longitude = results[0].geometry.location.lng();

			$scope.applyMap({latitude: latitude, longitude: longitude});
		});
	};

	$scope.applyMap = function(center) {
		$scope.$apply(function() {
			$scope.map.center = center;

			myService.setMap($scope.map);
		});
	};
});

// autocomplete gmap
app.directive('googleplace', function(myService) {
	return {
		require: 'ngModel',
		scope: false, // en mettant scope a false, on dit de ne pas créer de nouveau scope pour la directive, c'est donc le scope du parent qui sera pris, ce qui nous interesse ici
		link: function(scope, element, attrs, model) {
			var options = {
				types: ['address'],
			};

			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				var geoComponents = scope.gPlace.getPlace();

				// si lat ou lng est empty, on recupere les coordonnées par l'adresse dans l'input
				if (scope.isEmpty(geoComponents.latitude) || scope.isEmpty(geoComponents.longitude)) {
					scope.getAndApplyMap();
				} else { // ici, on a cliqué sur une proposition de l'autocomplete
					scope.applyMap({
						latitude: geoComponents.geometry.location.lat(),
						longitude: geoComponents.geometry.location.lng()
					});
				}
			});
		}
	};
});
