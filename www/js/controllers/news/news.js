app.controller("NewsCtrl",
    ["$scope", "NewsService", "AuthService", "$ionicLoading",
    function($scope, NewsService, AuthService, $ionicLoading){
        function updateNews(){
            var userPromise = AuthService.getUser();
            var newsPromise = NewsService.getNews();
            return NewsService.getNews().then(function(newsObjArr){
                $scope.$apply(function(){
                    $scope.newsList = newsObjArr;
                });
                AuthService.getUser().then(function(userObj){
                    $scope.$apply(function(){
                        if (userObj !== undefined){
                            $scope.isLoggedIn = true;
                        }
                    });
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