var arnieApp = angular.module('arnieApp',[]);

arnieApp.controller('ArnieController', ['$scope', '$http', '$timeout', '$interval', function($scope, $http, $timeout, $interval) {

  $scope.status = {};
  $scope.overlay = true; // Start with overlay
  $scope.time = '';

  var initStatusCheck,
      sessionStatusCheck,
      timer,
      seconds;

  // Initialize the app
  $scope.init = function(){
    // Check inital status
    $http.get('/status').success(function(data){
      $scope.status = data;
      // After getting status, connect to PC2MDB
      if(!$scope.status.serialPortOpen){
        $http.get('/connect').success(function(data){
          console.log("connected to machine", data);
          $scope.status = data;

          // Keep pinging status until Reader Enable (a.k.a "its go time")
          initStatusCheck = $interval(function(){
            console.log('ping initStatusCheck');
            $http.get('/status').success(function(data){
              $scope.status = data;
              if ($scope.status.machineReady) {
                $interval.cancel(initStatusCheck);
              }
            });
          }, 1000);

        });
      }
    });
  };
  $scope.init();

  // Start vending session
  $scope.startSession = function(){
    // Keep pinging status while session is active
    sessionStatusCheck = $interval(function(){
      console.log('ping sessionStatusCheck');
      $http.get('/status').success(function(data){
        $scope.status = data;
        if (!$scope.status.sessionStarted) {
          $interval.cancel(sessionStatusCheck);
        }
      });
    }, 1000);

    $http.get('/startsession').success(function(data){
      seconds = 30; // 30 second count down
      countdown();
      console.log("started session", data);
    });
  };

  // End vending session
  $scope.endSession = function(){
    // First checkstatus to see if vend is taking place
    $http.get('/status').success(function(data){
      console.log('endsession status',data);
      // If a vend is already in progress, prevent cancel
      if (!$scope.status.vendInProgress) {
        // Request to end session
          $http.get('/requestendsession').success(function(data){
            clearTimeout(timer);
            console.log("requested end session", data);
            // Actually end the session
            $http.get('/endsession').success(function(){
              console.log("ended session", data);
              // Reset scope status
              $scope.status = data;
            });
          });
        }
    });
  };

  // Check status
  $scope.statusCheck = function(){
    $http.get('/status').success(function(data){
      $scope.status = data;
    });
  };

  // Reload page
  $scope.reload = function(){
    location.reload();
  };

  // Count down from X to 0
  function countdown(){
    $http.get('/status').success(function(data){
      // As long as no vend is in progress, keep counting down
      if (!$scope.status.vendInProgress) {
        if (seconds === 0) {
            $scope.endSession();
          return;
        }
        $scope.time = seconds;
        seconds --;
        timer = setTimeout(countdown, 1000);
      }
      // TODO: add case for when user is stupid and selects an empty row, then chastise them.
    });
  }



}]);
