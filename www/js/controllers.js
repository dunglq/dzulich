angular.module('dzulich.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $state, auth) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.loginFB = function () {
      auth.$authWithOAuthRedirect("facebook").then(function (authData) {
        // User successfully logged in
      }).catch(function (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          auth.$authWithOAuthPopup("facebook").then(function (authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            console.log(authData);
            alert(authData);
            //$state.go('app.search');
          });
        } else {
          // Another error occurred
          console.log(error);
          $scope.modal.show();
        }
      });

      auth.$onAuth(function (authData) {
        if (authData === null) {
          console.log("Not logged in yet");
        } else {
          console.log("Logged in as", authData.uid);
        }
        $scope.authData = authData; // This will display the user's name in our view
      });
    };

  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })

  .controller('searchCtrl', function ($scope, $stateParams, items) {
    $scope.items = items;
    $scope.addItem = function () {
      var name = prompt("What do you need to buy?");
      if (name) {
        $scope.items.$add({
          "name": name
        });
      }
    };
  })

  .controller('discoverCtrl', function ($scope, $stateParams) {
  })

  .controller('countryCtrl', function ($scope, $stateParams, $firebaseArray, countries, $ionicLoading) {
    $scope.countries = countries;

    function reset() {
      $scope.country = null;
    }

    $scope.saveOrUpdate = function (country) {
      if (country.$id != null) {
        $scope.countries.$save(country).then(function (ref) {
          console.log("modified record with id " + ref.key());
        });
      } else {
        $scope.countries.$add(
          $scope.country
        ).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      }
      reset();
    }

    $scope.show = function (country) {
      $scope.country = country;
    }
  })

  .controller('cityCtrl', function ($scope, $stateParams, $firebaseArray, countries) {
    // initialize countries list
    $scope.countries = countries;

    function reset() {
      $scope.city = null;
    }

    $scope.saveOrUpdate = function (city) {
      if (city.$id != null) {
        $scope.cities.$save(city).then(function (ref) {
          console.log("modified record with id " + ref.key());
        });
      } else {
        $scope.cities.$add(
          $scope.city
        ).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      }
      reset()
    }

    $scope.show = function (city) {
      $scope.city = city;
    }

    $scope.showCities = function () {
      var cities = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities"));
      $scope.cities = cities;
      reset();
    }
  })

  .controller('attractionCtrl', function ($scope, $stateParams, $firebaseArray, countries) {
    // initialize countries list
    $scope.countries = countries;

    $scope.showCities = function () {
      var currCountry = countries.$getRecord();
      var cities = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities"));
      $scope.cities = cities;
    }

    $scope.showAttractions = function () {
      var attractions = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities")
          .child($scope.cityId)
          .child("attractions"));
      $scope.attractions = attractions;
    }

    $scope.show = function (attraction) {
      $scope.attraction = attraction;
    }

    $scope.saveOrUpdate = function (attraction) {
      if (attraction.$id != null) {
        $scope.attractions.$save(attraction).then(function (ref) {
          console.log("modified record with id " + ref.key());
        });
      } else {
        $scope.attractions.$add($scope.attraction).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      }
      reset()
    }

    function reset() {
      $scope.attraction = null;
    }
  })

  .controller('hotelCtrl', function ($scope, $stateParams, $firebaseArray, countries) {
    // initialize countries list
    $scope.countries = countries;

    $scope.showCities = function (countryId) {
      var cities = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child(countryId)
          .child("cities"));
      $scope.cities = cities;
    }

    $scope.showHotels = function (cityId) {
      var hotels = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities")
          .child(cityId)
          .child("hotels"));
      $scope.hotels = hotels;
    }

    $scope.show = function (hotel) {
      $scope.hotel = hotel;
    }

    $scope.saveOrUpdate = function (hotel) {
      if (hotel.$id != null) {
        $scope.hotels.$save(hotel).then(function (ref) {
          console.log("modified record with id " + ref.key());
        });
      } else {
        $scope.hotels.$add($scope.hotel).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      }
      reset();
    }

    function reset() {
      $scope.hotel = null;
    }
  })

  .controller('itineraryCtrl', function ($scope, $stateParams, $firebaseArray, $firebaseObject, countries) {
    // initialize countries list
    $scope.countries = countries;

    $scope.createItinerary = function () {
      var itineraries = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("itineraries"));

      var cities = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities"));
      $scope.cities = cities;

      // add new itinerary
      itineraries.$add($scope.itinerary)
        .then(function (itineraryRef) {
          console.log("added record with id " + itineraryRef.key());

          $scope.itinerary = $firebaseObject(
            (new Firebase("https://tripdiary.firebaseio.com/countries/"))
              .child($scope.countryId)
              .child("itineraries").child(itineraryRef.key()));

          var days = $firebaseArray(
            (new Firebase("https://tripdiary.firebaseio.com/countries/"))
              .child($scope.countryId)
              .child("itineraries").child(itineraryRef.key())
              .child("days"));

          days.$add({city: "", attraction: "", start: "00:00"})
            .then(function (ref) {
              console.log("added record with id " + ref.key());
              $scope.days = days;
            });


        });
    }

    $scope.addMoreDay = function (itinerary) {
      var days = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("itineraries").child(itinerary.$id)
          .child("days"));

      days.$add({city: "", attraction: "", start: "00:00"})
        .then(function (ref) {
          console.log("added record with id " + ref.key());
          $scope.days = days;
        });
    }

    $scope.showAttractions = function (cityId) {
      var attractions = $firebaseArray(
        (new Firebase("https://tripdiary.firebaseio.com/countries/"))
          .child($scope.countryId)
          .child("cities")
          .child(cityId)
          .child("attractions"));
      $scope.attractions = attractions;
    }

    $scope.saveDay = function (itinerary, day, attractionId) {
      // use firebase
      var dayRef = new Firebase("https://tripdiary.firebaseio.com/countries/")
        .child($scope.countryId).child("itineraries").child(itinerary.$id)
        .child("days").child((day.$id));
      dayRef.update({
        city: "1",
        attraction: attractionId,
        start: "00:00"
      })
    }


  })

  .factory("ref", function () {
    var ref = new Firebase("https://tripdiary.firebaseio.com/");
    return ref;
  })

  .factory("items", function ($firebaseArray) {
    var itemsRef = new Firebase("https://tripdiary.firebaseio.com/items");
    return $firebaseArray(itemsRef);
  })

  .factory("countries", function ($firebaseArray) {
    var countriesRef = new Firebase("https://tripdiary.firebaseio.com/countries");
    return $firebaseArray(countriesRef);
  })

  .factory("itineraries", function ($firebaseArray) {
    var countriesRef = new Firebase("https://tripdiary.firebaseio.com/countries/itineraries");
    return $firebaseArray(countriesRef);
  })

  .factory("cities", function ($firebaseArray) {
    var citiesRef = new Firebase("https://tripdiary.firebaseio.com/countries/cities");
    return $firebaseArray(citiesRef);
  })

  .factory("attractions", function ($firebaseArray) {
    var attractionRef = new Firebase("https://tripdiary.firebaseio.com/countries/cities/attractions");
    return $firebaseArray(attractionRef);
  })

  .factory("auth", function ($firebaseAuth) {
    var usersRef = new Firebase("https://tripdiary.firebaseio.com/users");
    return $firebaseAuth(usersRef);
  });
