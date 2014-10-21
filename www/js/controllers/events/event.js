
app.controller("EventCtrl",
    ["$scope",
     "EventService",
     "AuthService",
     "TaskService",
     "ExpenseService",
     "$state",
     "$ionicPopup",
     "$ionicActionSheet",
     "$location",
    function($scope,
             EventService,
             AuthService,
             TaskService,
             ExpenseService,
             $state,
             $ionicPopup,
             $ionicActionSheet,
             $location){
        function updateEventDetails(eventObj){
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

            var eventImagePromise = EventService.getEventImageSrc($scope.event_id);
            var allAttendancePromise = EventService.getAllAttendance($scope.event_id);


            return Promise.all([eventImagePromise, allAttendancePromise]).then(function(values){
                $scope.$apply(function(){
                    $scope.imgSrc = values[0];
                    var attendanceObj = values[1];
                    $scope.goingArr = attendanceObj.goingArr;
                    // $scope.notGoingArr = attendanceObj.notGoingArr;
                });
                return AuthService.getUser().then(function(userObj){
                    $scope.$apply(function(){
                        $scope.isAdmin = userObj.is_admin;
                        $scope.userObj = userObj;
                        $scope.isLoggedIn = true;
                    });
                    TaskService.getUserTasksForEvent($scope.event_id)
                    .then(function(userTasks){
                        $scope.$apply(function(){
                            $scope.userTasks = userTasks;
                        });
                    });
                    if (userObj.is_admin){
                        var taskPromise = TaskService.getTasksForEvent($scope.event_id);
                        var expensePromise = ExpenseService.getExpensesForEvent($scope.event_id);
                        var userAttendancePromise = EventService.getUserAttendance($scope.event_id);
                        return Promise.all([taskPromise, expensePromise, userAttendancePromise]).
                        then(function(values){
                            $scope.$apply(function(){
                                $scope.tasks = values[0];
                                $scope.expenses = values[1];
                                $scope.isGoing = values[2];
                                if ($scope.isGoing){
                                    $scope.attendanceState = "Going";
                                } else{
                                    $scope.attendanceState = "Not Going";
                                }
                            });
                        }, function(err){
                            console.error(err);
                        });
                    }
                });
            });
        };
        $scope.eventObj = EventService.getCurrentEvent();

        if ($scope.eventObj !== undefined){
            updateEventDetails($scope.eventObj);
        } else{
            var eventId = $location.search().id;
            if (eventId === undefined){
                $state.go("event-list");
                return;
            }
            EventService.getEvent(eventId).then(function(eventObj){
                $scope.eventObj = eventObj;
                EventService.updateCurrentEvent(eventObj);
                updateEventDetails(eventObj);
            }, function(){
                $state.go("event-list");
            });
            
        }
        
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
            $location.url("event/task?eid=" + $scope.event_id + "&tid=" + $scope.tasks[idx].taskId);
            return;
        };

        $scope.refresh = function(){
            updateEventDetails($scope.eventObj)
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

        function removeSelfFromGoingArr(goingArr){
            for (var i = 0; i < $scope.goingArr.length; i++){
                if (goingArr[i].user_id === $scope.userObj.user_id){
                    goingArr.splice(i,1);
                }
            }
        };

        function addSelfToGoingArr(goingArr){
            console.log($scope);
            goingArr.unshift({
                user_id: $scope.userObj.user_id,
                name: $scope.userObj.name,
                fb_id: $scope.userObj.fb_id,
                is_going: true
            });
        };

        $scope.updateUserAttendance = function(isGoing){
            EventService.updateUserAttendance($scope.event_id, isGoing)
            .then(function(){
                $scope.$apply(function(){
                    $scope.isGoing = isGoing;
                    if ($scope.isGoing){
                        $scope.attendanceState = "Going";
                        addSelfToGoingArr($scope.goingArr);
                    } else{
                        $scope.attendanceState = "Not Going";
                        removeSelfFromGoingArr($scope.goingArr);
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
                    if (index === 0 && !$scope.isGoing){
                        $scope.updateUserAttendance(true);
                    } else if(index === 1 && $scope.isGoing){
                        $scope.updateUserAttendance(false);
                    }
                    return true;
                }
            });
        };

        function openUserTasksPopup(){
            $ionicPopup.show({
                title: "My Tasks",
                templateUrl: "popups/user-tasks-popup.html",
                scope: $scope,
                buttons: [
                    {text: "Okay"}
                ]
            });
        }

        $scope.openTaskMenu = function(){
            $ionicActionSheet.show({
                buttons: [
                    {text: "Add Task"},
                    {text: "My Tasks"}
                ],
                cancelText: "<span class='assertive'/>Cancel</span>",
                cancel: function(){

                },
                buttonClicked: function(index){
                    if (index === 0){
                        $state.go("event-add-task");
                    } else if (index === 1){
                        openUserTasksPopup();
                    }
                    return true;
                }
            });
        };

        function showExpensePopup(){
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

        $scope.openFinanceMenu = function(){
            $ionicActionSheet.show({
                buttons: [
                    {text: "Add Expense"}
                ],
                cancelText: "<span class='assertive'/>Cancel</span>",
                cancel: function(){

                },
                buttonClicked: function(index){
                    if (index === 0){
                        showExpensePopup();
                    }
                    return true;
                }
            });
        };

        $scope.showAttendanceListPopup = function(){
            $ionicPopup.show({
                title: "Attendee List",
                templateUrl: "popups/attendance-list-popup.html",
                scope: $scope,
                buttons: [
                    {text: "Okay"}
                ]
            });
        };

}]);