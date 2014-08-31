app.controller("NewsCtrl",
    ["$scope", "NewsService", "AuthService", "$ionicLoading",
    function($scope, NewsService, AuthService, $ionicLoading){
        AuthService.getUser().then(function(userObj){
            $scope.$apply(function(){
                if (userObj !== undefined){
                    $scope.isLoggedIn = true;
                }
            });
        });

        $ionicLoading.show({
            template: "<i class='loading-icon ion-loading-a'></i>",
            delay: 300
        });
        NewsService.getNews().then(function(newsObjArr){
            console.log(newsObjArr);
            $scope.$apply(function(){
                $scope.newsList = newsObjArr;
                $ionicLoading.hide();
            });
        });
    }]
);