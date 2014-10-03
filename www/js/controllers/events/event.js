
app.controller("EventCtrl",
    ["$scope",
     "EventService",
     "AuthService",
     "TaskService",
     "ExpenseService",
     "$state",
     "$ionicPopup",
     "$ionicActionSheet",
    function($scope,
             EventService,
             AuthService,
             TaskService,
             ExpenseService,
             $state,
             $ionicPopup,
             $ionicActionSheet){
        function updateEventDetails(eventId, $scope, AuthService, TaskService, ExpenseService, EventService){
            return AuthService.getUser().then(function(userObj){
                $scope.$apply(function(){
                    $scope.isAdmin = userObj.is_admin;
                });

                if (!userObj.is_admin){
                    return;
                }
                var taskPromise = TaskService.getTasksForEvent(eventId);
                var expensePromise = ExpenseService.getExpensesForEvent(eventId);
                var attendancePromise = EventService.getAttendance(eventId);
                console.log("HE");
                return Promise.all([taskPromise, expensePromise, attendancePromise]).
                then(function(values){
                    console.log("DONE");
                    $scope.$apply(function(){
                        $scope.tasks = values[0];
                        $scope.expenses = values[1];
                        $scope.isGoing = values[2];
                        console.log(values);
                        if ($scope.isGoing){
                            $scope.attendanceState = "Going";
                        } else{
                            $scope.attendanceState = "Not Going";
                        }
                    });
                }, function(err){
                    console.error(err);
                });
            });
        }

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

        $scope.editForm = {
            description: $scope.description,
            budget: parseInt($scope.budget)
        };

        EventService.getEventImageSrc(eventObj.event_id)
        .then(function(imgSrc){
            $scope.$apply(function(){
                $scope.imgSrc = imgSrc;
            });
        });

        updateEventDetails($scope.event_id, $scope, AuthService, TaskService, ExpenseService, EventService);

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

        $scope.refresh = function(){
            updateEventDetails($scope.event_id, $scope, AuthService, TaskService, ExpenseService, EventService)
            .then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            }, function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.editDesc = function(newDesc){
            if ($scope.descEdit === undefined || $scope.descEdit === false){
                // toggle edit mode to active
                $scope.descEdit = true;
            } else{
                // toggle edit mode off, also when change is submitted
                if (newDesc === $scope.description){
                    $scope.descEdit = false;                    
                    return;
                }
                EventService.updateDescription($scope.event_id, newDesc)
                .then(function(){
                    $scope.$apply(function(){
                        $scope.description = newDesc;
                        $scope.descEdit = false;                    
                    });
                }, function(){
                    $ionicPopup.alert({
                        title: "<span class='red-text'>Failed to update description.</span>",
                        okType: "button"
                    });
                });
            }
        };

        $scope.editBudget = function(newBudget){
            if ($scope.budgetEdit === undefined || $scope.budgetEdit === false){
                // toggle edit mode to active
                $scope.budgetEdit = true;
            } else{
                // toggle edit mode off, also when change is submitted
                if (String(newBudget) === $scope.budget){
                    $scope.budgetEdit = false;                    
                    return;
                }
                EventService.updateBudget($scope.event_id, newBudget)
                .then(function(){
                    $scope.$apply(function(){
                        $scope.budget = newBudget;
                        $scope.budgetEdit = false;                    
                    });
                }, function(){
                    $ionicPopup.alert({
                        title: "<span class='red-text'>Failed to update budget.</span>",
                        okType: "button"
                    });
                });
            }
        };

        $scope.updateAttendance = function(isGoing){
            EventService.updateAttendance($scope.event_id, isGoing)
            .then(function(){
                $scope.$apply(function(){
                    $scope.isGoing = isGoing;
                    if ($scope.isGoing){
                        $scope.attendanceState = "Going";
                    } else{
                        $scope.attendanceState = "Not Going";
                    }
                });
            }, function(){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Failed to update attendance.</span>",
                    okType: "button"
                });
            });
        };

        $scope.openAttendanceMenu = function(){
            $ionicActionSheet.show({
                buttons: [
                    {text: "Going"},
                    {text: "Not Going"}
                ],
                cancelText: "<span class='assertive'/>Cancel</span>",
                cancel: function(){

                },
                buttonClicked: function(index){
                    if (index === 0){
                        $scope.updateAttendance(true);
                    } else if(index === 1){
                        $scope.updateAttendance(false);
                    }
                    return true;
                }
            });
        }

}]);