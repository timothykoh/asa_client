app.factory("TaskService", ["$rootScope", "$http", function($rootScope, $http){
    var TaskService = function(){
        var _currentTaskObj = undefined;

        this.getTask = function(taskId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "task", {
                    params: {
                        taskId: taskId
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

        this.getTasksForEvent = function(eventId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "task/by_event", {
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

        this.getUserTasksForEvent = function(eventId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "task/by_event/for_user", {
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

        this.deleteTask = function(taskId, eventId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "task/delete", {
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

        this.updateCurrentTask = function(taskObj){
            _currentTaskObj = taskObj;
        };

        this.getCurrentTask = function(){
            return _currentTaskObj;
        };

        this.timeSlotSignUp = function(timeSlotId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "task/timeslot/signup", {
                    timeSlotId: timeSlotId
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

        this.timeSlotCancel = function(timeSlotId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "task/timeslot/cancel", {
                    timeSlotId: timeSlotId
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
        }
    };
    return new TaskService();
}]);
