// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dzulich', ['ionic', 'dzulich.controllers', 'firebase'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'searchCtrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
      .state('app.country', {
        url: '/country',
        views: {
          'menuContent': {
            templateUrl: 'templates/country.html',
            controller: 'countryCtrl'
          }
        }
      })
      .state('app.country-view', {
        url: '/country-view',
        views: {
          'menuContent': {
            templateUrl: 'templates/country-view.html',
            controller: 'countryCtrl'
          }
        }
      })
      .state('app.city', {
        url: '/city',
        views: {
          'menuContent': {
            templateUrl: 'templates/city.html',
            controller: 'cityCtrl'
          }
        }
      })
      .state('app.attraction', {
        url: '/attraction',
        views: {
          'menuContent': {
            templateUrl: 'templates/attraction.html',
            controller: 'attractionCtrl'
          }
        }
      })
      .state('app.hotels', {
        url: '/hotel',
        views: {
          'menuContent': {
            templateUrl: 'templates/hotel.html',
            controller: 'hotelCtrl'
          }
        }
      })
      .state('app.itinerary-create', {
        url: '/itinerary-create',
        views: {
          'menuContent': {
            templateUrl: 'templates/itinerary-create.html',
            controller: 'itineraryCtrl'
          }
        }
      })
      .state('app.itinerary-list', {
        url: '/itinerary-list/:countryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/itinerary-list.html',
            controller: 'itineraryCtrl'
          }
        }
      })
      .state('app.itinerary-view', {
        url: '/itinerary-view/:countryId/:itineraryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/itinerary-view.html',
            controller: 'itineraryDetailCtrl'
          }
        }
      })
      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })
      .state('app.discover', {
        url: '/discover',
        views: {
          'menuContent': {
            templateUrl: 'templates/discover.html',
            controller: 'discoverCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app/country');
  });
