app.controller("ProfileCtrl", ["$scope", "AuthService", function($scope, AuthService){
    $scope.user = {};
    
    function updateUserData(userObj){
        $scope.$apply(function(){
            if (userObj !== undefined && userObj !== ""){
                $scope.user = userObj;
                $scope.isLoggedIn = true;
                $scope.isAdmin = userObj.is_admin;
            } else{
                $scope.isLoggedIn = false;
            }
        });
    };

    AuthService.getUser().then(updateUserData);

    $scope.login = function(){
        AuthService.login().then(updateUserData);
    };

    $scope.logout = function(){
        AuthService.logout().then(function(){
            $scope.$apply(function(){
                $scope.user = undefined;
                $scope.isLoggedIn = false;
            });
        });
    };
}]);