app.controller("EventListCtrl",
    ["$scope", "EventService", "AuthService", "$state", "$ionicLoading",
    function($scope, EventService, AuthService, $state, $ionicLoading){
        $ionicLoading.show({
            template: "<i class='loading-icon ion-loading-a'></i>",
            delay: 300
        });
        EventService.getEvents().then(function(events){
            $scope.$apply(function(){
                $scope.events = events;
                $ionicLoading.hide();
            });
        });

        AuthService.getUser().then(function(userObj){
            $scope.$apply(function(){
                if (userObj !== undefined){
                    $scope.isLoggedIn = true;
                    $scope.isAdmin = userObj.is_admin;
                }    
            });
        });

        $scope.viewEvent = function(idx){
            EventService.updateCurrentEvent($scope.events[idx]);
            $state.go("event");
        };
}]);