angular.module('starter.factories')

  .factory("items", function ($firebaseArray) {
    var itemsRef = new Firebase("https://tripdiary.firebaseio.com/items");
    return $firebaseArray(itemsRef);
  })

  .factory("auth", function ($firebaseAuth) {
    var usersRef = new Firebase("https://tripdiary.firebaseio.com/users");
    return $firebaseAuth(usersRef);
  });
