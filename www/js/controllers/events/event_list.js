app.controller("EventListCtrl",
    ["$scope", "EventService", "AuthService", "$state", "$ionicLoading", "$location",
    function($scope, EventService, AuthService, $state, $ionicLoading, $location){
        function updateEventList(){
            var eventPromise = EventService.getEvents();
            var userPromise = AuthService.getUser();
            return EventService.getEvents().then(function(eventObjArr){
                $scope.$apply(function(){
                    $scope.events = eventObjArr;
                });
                AuthService.getUser().then(function(userObj){
                    $scope.$apply(function(){
                        if (userObj !== undefined){
                            $scope.isLoggedIn = true;
                            $scope.isAdmin = userObj.is_admin;
                        }
                    });
                });
            });
        }

        $ionicLoading.show({
            template: "<i class='loading-icon ion-loading-a'></i>",
            delay: 300
        });

        updateEventList().then(function(){
            $ionicLoading.hide();
        });

        
        $scope.viewEvent = function(idx){
            EventService.updateCurrentEvent($scope.events[idx]);
            $location.url("event?id=" + $scope.events[idx].event_id);
        };

        $scope.refresh = function(){
            updateEventList().then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            }, function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
}]);