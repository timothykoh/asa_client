app.factory("EventService", ["$rootScope", "$http", function($rootScope, $http){
    function EventService(){
        var _currentEventObj = undefined;

        this.createEvent = function(eventDetails, imgData){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "event/create", {
                    eventDetails: eventDetails,
                    imgData: imgData
                }).success(function(res){
                    if (res.status === "success"){
                        resolve();
                    } else{
                        reject();
                    }
                }).error(function(err){
                    console.error(err);
                    reject();
                });
            });
        };

        this.getEvents = function(){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "event")
                .success(function(res){
                    if (res.status === "success"){
                        resolve(res.results);
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

        this.updateDescription = function(eventId, newDesc){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "event/update_description",{
                    eventId: eventId,
                    description: newDesc
                }).success(function(res){
                    if (res.status === "success"){
                        resolve(res.results);
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

        this.updateBudget = function(eventId, newBudget){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "event/update_budget",{
                    eventId: eventId,
                    budget: newBudget
                }).success(function(res){
                    if (res.status === "success"){
                        resolve(res.results);
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

        this.updateCurrentEvent = function(eventObj){
            _currentEventObj = eventObj;
        };

        this.getCurrentEvent = function(){
            return _currentEventObj;
        };

        this.getEventImageSrc = function(eventId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "event/image",{
                    params: {
                        eventId: eventId
                    }
                }).success(function(res){
                    if (res.status === "success"){
                        resolve(res.results);
                    } else{
                        reject(res.error);
                    }
                }).error(function(err){
                    reject(err);
                });
            });
        };
    };

    return new EventService();
}]);
