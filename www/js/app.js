// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    // controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

.controller('MapCtrl', function($scope, $ionicPopup, $timeout, $state, $cordovaGeolocation, $ionicSideMenuDelegate) {
  var config = {
    apiKey: "AIzaSyCwoHVYS_N5ktPsd-yyMKvrU8YDCw-AtVU",
    authDomain: "greenglassweb.firebaseapp.com",
    databaseURL: "https://greenglassweb.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "428351029929"
  };
  firebase.initializeApp(config);
  var rootRef = firebase.database().ref();
  rootRef.on("value", function(snapshot) {
    $scope.markers = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


   $scope.openMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.filter = [];
   $scope.toggleFilter = function(categ) {

      if ($scope.filter.indexOf(categ) !== -1){
        $scope.filter.splice($scope.filter.indexOf(categ),1);
      }
      else{
        $scope.filter.push(categ);
      }
      $scope.placeMarkers();
    };

    $scope.markersOnMap=[];

    $scope.placeMarkers = function(){
      $scope.markersOnMap.forEach(function(markerOnMap){
        markerOnMap.setMap(null);
      });
      $scope.markers.forEach(function(marker){
        if ($scope.filter.indexOf(marker.categorie)!== -1){
          var img = marker.img;
          marker.locations.forEach(function(location){
            $scope.markersOnMap.push(
              new google.maps.Marker({
                position: location.latlng,
                map: $scope.map,
                title: location.legende,
                icon: img
              })
            );
          });
        }
        else{

        }
      });
    };

  var options = {timeout: 10000, enableHighAccuracy: true};
  var addMarker = function (categorie, location) {
    $scope.myMarkers.forEach(function(marker, index){
      if(marker.categorie === categorie){
        $scope.myMarkers[index].locations.push(location);
      }
    });
  }
  // A confirm dialog
  $scope.showConfirm = function() {
   var addGlass = $ionicPopup.confirm({
     title: 'Ajouter un point de récupération',
     template: 'Si tu bullshit, je te casse les jambes'
   });

   addGlass.then(function(res) {
     if(res) {
       $cordovaGeolocation.getCurrentPosition(options).then(function(position){
         var location = {};
         var newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         location.latlng = newLatLng.toJSON();
         location.indice = 1;
         addMarker('verre', location);
      });
     } else {
       console.log('You are not sure');
     }
   });
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  function ContentController($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
  }

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
    alert("Could not get location");
  });

});


/*
.directive('ionSideMenus', ['$ionicBody', function($ionicBody) {
  return {
    restrict: 'ECA',
    controller: '$ionicSideMenus',
    compile: function(element, attr) {
      attr.$set('class', (attr['class'] || '') + ' view');

      return { pre: prelink };
      function prelink($scope, $element, $attrs, ctrl) {

        ctrl.enableMenuWithBackViews($scope.$eval($attrs.enableMenuWithBackViews));

        $scope.$on('$ionicExposeAside', function(evt, isAsideExposed) {
          if (!$scope.$exposeAside) $scope.$exposeAside = {};
          $scope.$exposeAside.active = isAsideExposed;
          $ionicBody.enableClass(isAsideExposed, 'aside-open');
        });

        $scope.$on('$ionicView.beforeEnter', function(ev, d) {
          if (d.historyId) {
            $scope.$activeHistoryId = d.historyId;
          }
        });

        $scope.$on('$destroy', function() {
          $ionicBody.removeClass('menu-open', 'aside-open');
        });

      }
    }
  };
}]);
*/
