app.factory("TaskService", ["$rootScope", "$http", function($rootScope, $http){
    var TaskService = function(){
        this.getTasksForEvent = function(eventId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "task", {
                    params: {
                        eventId: eventId
                    }
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

        this.createTask = function(taskDetails, eventId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "task/create", {
                    taskDetails: taskDetails,
                    eventId: eventId
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

        this.deleteTask = function(taskId, eventId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "task/delete", {
                    eventId: eventId,
                    taskId: taskId
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
    };
    return new TaskService();
}]);