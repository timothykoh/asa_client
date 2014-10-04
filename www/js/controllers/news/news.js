app.controller("NewsCtrl",
    ["$scope", "NewsService", "AuthService", "$ionicLoading",
    function($scope, NewsService, AuthService, $ionicLoading){
        function updateNews(){
            var userPromise = AuthService.getUser();
            var newsPromise = NewsService.getNews();

            return Promise.all([userPromise, newsPromise]).then(function(values){
                $scope.$apply(function(){
                    var userObj = values[0];
                    if (userObj !== undefined){
                        $scope.isLoggedIn = true;
                    }
                    $scope.newsList = values[1];
                });
            });
            
        }

        $ionicLoading.show({
            template: "<i class='loading-icon ion-loading-a'></i>",
            delay: 300
        });

        updateNews().then(function(){
            $ionicLoading.hide();
        });

        $scope.refresh = function(){
            updateNews().then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            }, function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    }]
);