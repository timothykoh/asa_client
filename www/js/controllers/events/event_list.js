app.controller("EventListCtrl",
    ["$scope", "EventService", "AuthService", "$state", "$ionicLoading",
    function($scope, EventService, AuthService, $state, $ionicLoading){
        function updateEventList(){
            var eventPromise = EventService.getEvents();
            var userPromise = AuthService.getUser();

            return Promise.all([eventPromise, userPromise]).then(function(values){
                $scope.$apply(function(){
                    $scope.events = values[0];
                    var userObj = values[1];
                    if (userObj !== undefined){
                        $scope.isLoggedIn = true;
                        $scope.isAdmin = userObj.is_admin;
                    }
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
            $state.go("event");
        };

        $scope.refresh = function(){
            updateEventList().then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            }, function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
}]);