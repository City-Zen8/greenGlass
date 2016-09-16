// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');
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
.controller('MapCtrl', function($scope, $ionicPopup, $timeout, $state, $cordovaGeolocation, $cordovaFile) {

  var config = {
    apiKey: "AIzaSyCwoHVYS_N5ktPsd-yyMKvrU8YDCw-AtVU",
    authDomain: "greenglassweb.firebaseapp.com",
    databaseURL: "https://greenglassweb.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "428351029929"
  };
  firebase.initializeApp(config);
  var rootRef = firebase.database().ref();
  console.log(rootRef);
  rootRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  var options = {timeout: 10000, enableHighAccuracy: true};
  var addMarker = function (categorie, location) {
    $scope.myMarkers.forEach(function(marker, index){
      if(marker.categorie === categorie){
        $scope.myMarkers[index].locations.push(location);
        console.log(marker);
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

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);7


  function get(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        req.send();
    });
}

function getJSON(url) {
    return get(url).then(JSON.parse);
}

getJSON('data/markers.json')
    .then(function(markers){
      $scope.myMarkers = markers;
      var filtre = ['verre', 'boiteLettre', 'cabine'];
      markers.forEach(function(marker){
        if (filtre.indexOf(marker.categorie)!== -1){
          var img = marker.img;
          marker.locations.forEach(function(location){
            new google.maps.Marker({
              position: location.latlng,
              map: $scope.map,
              title: location.legende,
              icon: img
            });
          });
        }
      });

     /*   markers.forEach(function(marker){
          new google.maps.Marker({
            position: marker,
            map: $scope.map,
            title: 'Recup verre',
            icon: ''
          });
        })*/
      }, function(e){
          console.log("Log markers: " + e);
      });

  }, function(error){
    console.log("Could not get location");
    alert("Could not get location");
  });
});
