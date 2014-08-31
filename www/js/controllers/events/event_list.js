app.controller("EventListCtrl",
    ["$scope", "EventService", "AuthService", "$state",
    function($scope, EventService, AuthService, $state){
        EventService.getEvents().then(function(events){
            $scope.$apply(function(){
                $scope.events = events;
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