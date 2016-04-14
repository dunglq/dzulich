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
      $scope.name = '';
      $scope.code = '';
      $scope.imgUrl = '';
      $scope.shortDesc = '';
      $scope.longDesc = '';
      $scope.id = '';
    }

    $scope.saveOrUpdate = function () {
      if ($scope.id === null) {
        $scope.countries.$add({
          name: $scope.name,
          code: $scope.code,
          imgUrl: $scope.imgUrl,
          shortDesc: $scope.shortDesc,
          longDesc: $scope.longDesc
        }).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      } else {
        var id = $scope.id;
        var country = countries.$getRecord(id);
        country.name = $scope.name;
        country.code = $scope.code;
        country.imgUrl = $scope.imgUrl;
        country.shortDesc = $scope.shortDesc;
        country.longDesc = $scope.longDesc;
        countries.$save(country).then(function (ref) {
          console.log("added record with id " + ref.key());
        });
      }
      reset();
    }

    $scope.show = function (country) {
      $scope.name = country.name;
      $scope.code = country.code;
      $scope.imgUrl = country.imgUrl;
      $scope.shortDesc = country.shortDesc;
      $scope.longDesc = country.longDesc;
      $scope.id = country.$id;
    }
  })

  .controller('cityCtrl', function ($scope, $stateParams, $firebaseArray, countries, firebase, $ionicLoading) {
    // initialize countries list
    $scope.countries = countries;

    function showLoading() {
      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 100,
        showDelay: 0
      });
    }

    function hideLoading() {
      // Setup the loader
      $ionicLoading.hide();
    }

    function reset() {
      $scope.name = '';
      $scope.code = '';
      $scope.imgUrl = '';
      $scope.shortDesc = '';
      $scope.longDesc = '';
      $scope.id = '';
    }

    $scope.saveOrUpdate = function () {
      var cities = $scope.cities;
      // add new
      var cityId = $scope.id;
      showLoading();
      if (cityId == null || cityId == '') {
        cities.$add({
          name: $scope.name,
          code: $scope.code,
          imgUrl: $scope.imgUrl,
          shortDesc: $scope.shortDesc,
          longDesc: $scope.longDesc
        }).then(function (ref) {
          $scope.cities = cities;
          reset();
          hideLoading();
        });
      } else {
        var currCity = cities.$getRecord(cityId);
        currCity.name = $scope.name;
        currCity.code = $scope.code;
        currCity.imgUrl = $scope.imgUrl;
        currCity.shortDesc = $scope.shortDesc;
        currCity.longDesc = $scope.longDesc;
        cities.$save(currCity).then(function (ref) {
          $scope.cities = cities;
          reset();
          hideLoading();
        });
      }
    }

    $scope.show = function (city) {
      // get from scope (city list already loaded before)
      var cities = $scope.cities;
      var currCity = cities.$getRecord(city.$id);
      $scope.name = currCity.name;
      $scope.code = currCity.code;
      $scope.imgUrl = currCity.imgUrl;
      $scope.shortDesc = currCity.shortDesc;
      $scope.longDesc = currCity.longDesc;
      $scope.id = currCity.$id;
    }

    $scope.delete = function (city) {
      // get from scope (city list already loaded before)
      var cities = $scope.cities;
      showLoading();
      var currCity = cities.$getRecord(city.$id);
      cities.$remove(currCity).then(function (ref) {
        //ref.key() === item.$id; // true
        $scope.cities = cities;
        hideLoading();
      });
    }

    $scope.showCities = function () {
      var currCountry = countries.$getRecord($scope.countryId);
      var cities = $firebaseArray(new Firebase("https://tripdiary.firebaseio.com/countries/" + currCountry.$id + "/cities"));
      $scope.cities = cities;
      reset();
    }
  })

  .controller('activityCtrl', function ($scope, $stateParams, $firebaseArray, countries, activities, firebase, $ionicLoading) {
    // initialize countries list
    $scope.countries = countries;

    $scope.enableCities = function () {
      var currCountry = countries.$getRecord($scope.countryId);
      var cities = $firebaseArray(new Firebase("https://tripdiary.firebaseio.com/countries/" + currCountry.$id + "/cities"));
      $scope.cities = cities;
    }

    $scope.showActivities = function () {
      var currCountry = countries.$getRecord($scope.countryId);
      var cities = $firebaseArray(new Firebase("https://tripdiary.firebaseio.com/countries/" + currCountry.$id + "/cities"));
      var currCity = cities.$getRecord($scope.cityId);

      var activities = $firebaseArray(new Firebase("https://tripdiary.firebaseio.com/countries/"
        + currCountry.$id + "/cities" + currCity.$id));
      $scope.activities = activities;
    }
  })
  .
  factory("firebase", function () {
    var firebase = new Firebase("https://tripdiary.firebaseio.com/");
    return firebase;
  })

  .factory("items", function ($firebaseArray) {
    var itemsRef = new Firebase("https://tripdiary.firebaseio.com/items");
    return $firebaseArray(itemsRef);
  })

  .factory("countries", function ($firebaseArray) {
    var countriesRef = new Firebase("https://tripdiary.firebaseio.com/countries");
    return $firebaseArray(countriesRef);
  })

  .factory("cities", function ($firebaseArray) {
    var citiesRef = new Firebase("https://tripdiary.firebaseio.com/countries/cities");
    return $firebaseArray(citiesRef);
  })

  .factory("activities", function ($firebaseArray) {
    var activityRef = new Firebase("https://tripdiary.firebaseio.com/countries/cities/activities");
    return $firebaseArray(activityRef);
  })

  .factory("auth", function ($firebaseAuth) {
    var usersRef = new Firebase("https://tripdiary.firebaseio.com/users");
    return $firebaseAuth(usersRef);
  });
