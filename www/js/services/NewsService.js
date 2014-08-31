app.factory("NewsService", ["$rootScope", "$http", function($rootScope, $http){
    function NewsService(){
        this.createNews = function(newsDetails, imgData){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "news/create",{
                    newsDetails: newsDetails,
                    imgData: imgData
                }).success(function(res){
                    if (res.status === "success"){
                        resolve();
                    } else{
                        console.error(res.error);
                        reject(res.error);
                    }
                }).error(function(err){
                    console.error(err);
                    reject(err);
                });
            });
        };

        this.getNews = function(){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "news")
                .success(function(res){
                    if (res.status === "success"){
                        resolve(res.results);
                    } else{
                        console.error(res.error);
                        reject(res.error);
                    }
                }).error(function(err){
                    console.error(err);
                    reject();
                });
            });
        }
    };

    return new NewsService();
}]);