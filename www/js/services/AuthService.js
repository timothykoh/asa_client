app.factory("AuthService", ["$rootScope", "$http", "FacebookService", function($rootScope, $http, FacebookService){
    function AuthService(){
        var _userObjPromise;

        this.getUser = function(){
            if (_userObjPromise !== undefined){
                return _userObjPromise;
            } else{
                _userObjPromise = new Promise(function(resolve, reject){
                    $http.get($rootScope.serverBaseUrl + "user").success(function(res){
                        if (res.status === "success"){
                            var userObj = res.results;
                            resolve(userObj);
                        } else{
                            reject();
                        }
                    }).error(function(){
                        reject();
                    });
                });
                return _userObjPromise;
            }
        };

        this.login = function(){
            console.log("Logging in...");
            _userObjPromise = new Promise(function(resolve, reject){
                FacebookService.login().then(function(fbAccessToken){
                    if (fbAccessToken === undefined){
                        return console.log("Couldn't retrieve access token from log in.");
                    }
                    $http.post($rootScope.serverBaseUrl + "auth/login", {
                        fbAccessToken: fbAccessToken
                    }).success(function(userObj){
                        resolve(userObj);
                    }).error(function(err){
                        console.error(err);
                        reject(err);
                    });
                });
            });
            return _userObjPromise;
        };

        this.logout = function(){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "auth/logout")
                .success(function(res){
                    if (res.status === "success"){
                        _userObjPromise = new Promise(function(resolve, reject){
                            resolve(undefined);
                        });
                        resolve();
                    } else{
                        console.error(res.error);
                        reject(err);
                    }
                }).error(function(err){
                    console.error(err);
                    reject(err);
                });
            })
        };
    }

    return new AuthService();
}]);