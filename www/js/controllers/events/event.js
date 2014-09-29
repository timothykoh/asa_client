function updateEventDetails(eventId, $scope, AuthService, TaskService, ExpenseService){
    AuthService.getUser().then(function(userObj){
        $scope.$apply(function(){
            $scope.isAdmin = userObj.is_admin;
        });

        if (userObj.is_admin){
            TaskService.getTasksForEvent(eventId)
            .then(function(tasks){
                $scope.$apply(function(){
                    console.log($scope.tasks);
                    console.log(tasks);
                    if ($scope.tasks != tasks){
                        $scope.tasks = tasks;
                    }
                });
            });
            ExpenseService.getExpensesForEvent(eventId)
            .then(function(expenses){
                $scope.$apply(function(){
                    if ($scope.expenses != expenses){
                        $scope.expenses = expenses;
                    }
                });
            });
        }
    });
}

app.controller("EventCtrl",
    ["$scope", "EventService", "AuthService", "TaskService", "ExpenseService", "$state", "$ionicPopup",
    function($scope, EventService, AuthService, TaskService, ExpenseService, $state, $ionicPopup){
        var eventObj = EventService.getCurrentEvent();
        if (eventObj === undefined){
            $state.go("event-list");
            return;
        }
        $scope.event_id = eventObj.event_id;
        $scope.name = eventObj.name;
        $scope.description = eventObj.description;
        $scope.date = eventObj.date;
        $scope.location = eventObj.location;
        $scope.budget = eventObj.budget;

        $scope.task = {}; //used for adding new tasks
        $scope.expense = {}; //used for adding new expenses

        $scope.tasks = [];
        $scope.expenses = [];

        EventService.getEventImageSrc(eventObj.event_id)
        .then(function(imgSrc){
            $scope.$apply(function(){
                $scope.imgSrc = imgSrc;
            });
        });

        updateEventDetails($scope.event_id, $scope, AuthService, TaskService, ExpenseService);

        $scope.deleteTask = function(idx){
            var task = $scope.tasks[idx];
            TaskService.deleteTask(task.taskId)
            .then(function(){
                console.log("delete task success");
                $scope.$apply(function(){
                    $scope.tasks.splice(idx,1);
                });
            }, function(){
                console.log("delete task fail");
            });
        };

        $scope.deleteExpense = function(idx){
            var expense = $scope.expenses[idx];
            ExpenseService.deleteExpense(expense.expense_id, $scope.event_id)
            .then(function(){
                console.log("delete expense success");
                $scope.$apply(function(){
                    $scope.expenses.splice(idx,1);
                });
            }, function(){
                console.log("delete expense fail");
            });
        };
        $scope.selectTask = function(idx){
            TaskService.updateCurrentTask($scope.tasks[idx]);
            $state.go("event-task");
            return;
        };

        $scope.showExpensePopup = function(){
            $ionicPopup.show({
                title: "Expense Details",
                templateUrl: "popups/add-expense-popup.html",
                scope: $scope,
                buttons: [
                    {
                        text: "Cancel",
                        onTap: function(e){
                            $scope.expense = {};
                        }
                    },
                    {
                        text: "Add",
                        type: "button-positive",
                        onTap: function(e){
                            if ($scope.expense.name === undefined || $scope.expense.amount === undefined){
                                e.preventDefault();
                            } else{
                                var expenseObj = {
                                    name: $scope.expense.name,
                                    description: $scope.expense.description,
                                    amount: $scope.expense.amount
                                };
                                $scope.expense = {};

                                console.log(expenseObj);
                                ExpenseService.createExpense(expenseObj, $scope.event_id)
                                .then(function(createdExpenseObj){
                                    $scope.expenses.push(createdExpenseObj);
                                    console.log("Expense added");
                                }, function(){
                                    $ionicPopup.show({
                                        title: "<span class='red-text'>Failed to add expense.</span>",
                                        buttons: [
                                            {
                                                text: "Okay"
                                            }
                                        ]
                                    });
                                });
                            }
                        }
                    }
                ]
            })
        };

        var pollInterval = setInterval(function(){
            updateEventDetails($scope.event_id, $scope, AuthService, TaskService, ExpenseService);
        }, 1000);

        $scope.back = function(){
            clearInterval(pollInterval);
            $state.go("event-list");
        };

}]);