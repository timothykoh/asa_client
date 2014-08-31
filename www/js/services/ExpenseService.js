app.factory("ExpenseService", ["$rootScope", "$http", function($rootScope, $http){
    function ExpenseService(){
        this.getExpensesForEvent = function(eventId){
            return new Promise(function(resolve, reject){
                $http.get($rootScope.serverBaseUrl + "expense", {
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

        this.createExpense = function(expenseDetails, eventId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "expense/create", {
                    expenseDetails: expenseDetails,
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

        this.deleteExpense = function(expenseId, eventId){
            return new Promise(function(resolve, reject){
                $http.post($rootScope.serverBaseUrl + "expense/delete",{
                    eventId: eventId,
                    expenseId: expenseId
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
    }

    return new ExpenseService();
}]);
