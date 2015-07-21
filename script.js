angular.module('services', []).factory('myService', function () {

	service_map = {
		center: { latitude: 0, longitude: 0},
		zoom: 8
	};

	var getMap = function() {
		return this.service_map;
	}

	var setMap = function(map) {
		this.service_map = map;
	}

	return {
		getMap: getMap,
		setMap: setMap
	}
});



var app = angular.module('myApplicationModule', ['uiGmapgoogle-maps', 'services']);

var controller = app.controller('myCtrl', function($scope, myService) {
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	$scope.viewMap = function() {
		console.log(myService.getMap());
	}
});

// autocomplete gmap
app.directive('googleplace', function(myService) {
    return {
	    require: 'ngModel',
	    scope: false, // en mettant scope a false, on dit de ne pas créer de nouveau scope pour la directive, c'est donc le scope du parent qui sera pris, ce qui nous interesse ici
	    link: function(scope, element, attrs, model) {
	        var options = {
	            types: ['(cities)'],
	        };

	        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

	        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
	            var geoComponents = scope.gPlace.getPlace();
	            var latitude = geoComponents.geometry.location.lat();
	            var longitude = geoComponents.geometry.location.lng();

	            scope.$apply(function() {
	            	scope.map.center.latitude = latitude;
	            	scope.map.center.longitude = longitude;

	            	myService.setMap(scope.map);

	                model.$setViewValue(element.val());
	            });
	        });
	    }
	};
});



