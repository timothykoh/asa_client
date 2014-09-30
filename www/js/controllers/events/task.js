app.controller("TaskCtrl",
    ["$scope", "TaskService", "AuthService", "$state", "$ionicPopup",
    function($scope, TaskService, AuthService, $state, $ionicPopup){
        function buildAssigneeStr(assigneeArr){
            if (assigneeArr.length === 0){
                return "";
            }
            var s = "";
            var isSelfAssigned = false;
            for (var i = 0; i < assigneeArr.length; i++){
                var assignee = assigneeArr[i];
                if (assignee.isSelf){
                    s = "You, " + s;
                    isSelfAssigned = true;
                } else{
                    s += assignee.name + ", ";
                }
            }
            s = s.replace(/, $/g,"");
            if (!isSelfAssigned && assigneeArr.length == 1){
                var verb = "has";
            } else{
                verb = "have";
            }
            s += " " + verb + " signed up";
            return s;
        }

        function addSelfToAssigneeArr(assigneeArr, userId, name, fbId){
            assigneeArr.unshift({
                userId: userId,
                name: name,
                fbId: fbId,
                isSelf:true
            });
        }

        function removeSelfFromAssigneeArr(assigneeArr){
            for (var i = 0; i < assigneeArr.length; i++){
                if (assigneeArr[i].isSelf){
                    assigneeArr.splice(i,1);
                    return;
                }
            }
        }

        function updateTask($scope, taskObj){
            $scope.name = taskObj.name;
            var months = ["January","February","March","April","May","June","July",
                          "August", "September", "October", "November", "December"];
            var dateTaskObjArr = taskObj.timeSlotObjArr.map(function(elem){
                if (elem.timeSlotId === null){
                    return {};
                }
                var dateObj = new Date(elem.date);
                var dateStr = dateObj.getUTCDate() + " " + months[dateObj.getUTCMonth()] +
                              " " + dateObj.getUTCFullYear();
                var assigneeStr = buildAssigneeStr(elem.assigneeArr);
                var hasSignedUp = false;
                for (var i = 0; i < elem.assigneeArr.length; i++){
                    if (elem.assigneeArr[i].isSelf === true){
                        hasSignedUp = true;
                        break;
                    }
                }
                return {
                    date: elem.date,
                    formattedDate: dateStr,
                    timeSlotObjArr: [{
                        timeSlotId: elem.timeSlotId,
                        timeSlot: elem.timeSlot,
                        numPeople: elem.numPeople,
                        numAssignees: elem.numAssignees,
                        assigneeArr: elem.assigneeArr,
                        assigneeStr: assigneeStr,
                        hasSignedUp: hasSignedUp
                    }]
                };
            });

            var groupedDateTaskObjArr = [];
            var currDateTaskObj = undefined;
            for (var i = 0; i < dateTaskObjArr.length; i++){
                var dateTaskObj = dateTaskObjArr[i];
                if (Object.keys(dateTaskObj).length === 0){
                    continue;
                }
                if (currDateTaskObj === undefined || currDateTaskObj.date !== dateTaskObj.date){
                    currDateTaskObj = dateTaskObj;
                    groupedDateTaskObjArr.push(currDateTaskObj);
                } else{
                    currDateTaskObj.timeSlotObjArr = currDateTaskObj.timeSlotObjArr.concat(dateTaskObj.timeSlotObjArr);
                }
            }
            $scope.dateTaskObjArr = groupedDateTaskObjArr;
        }

        var taskObj = TaskService.getCurrentTask();
        console.log(taskObj);
        if (taskObj === undefined){
            $state.go("event-list");
            return;
        }
        var taskId = taskObj.taskId;
        updateTask($scope, taskObj);

        $scope.timeSlotSignUp = function(timeSlotId, dateTaskObjIdx, timeSlotObjIdx){
            TaskService.timeSlotSignUp(timeSlotId)
            .then(function(){
                AuthService.getUser().then(function(userObj){
                    $scope.$apply(function(){
                        var dateTaskObj = $scope.dateTaskObjArr[dateTaskObjIdx];
                        var timeSlotObj = dateTaskObj.timeSlotObjArr[timeSlotObjIdx];
                        addSelfToAssigneeArr(timeSlotObj.assigneeArr, userObj.user_id, userObj.name, userObj.fb_id);
                        var assigneeStr = buildAssigneeStr(timeSlotObj.assigneeArr);
                        timeSlotObj.assigneeStr = assigneeStr;
                        timeSlotObj.numAssignees += 1;
                        timeSlotObj.hasSignedUp = true;
                    });
                });
                // $ionicPopup.alert({
                //     title: "Sign up success!",
                //     okType: "button"
                // });
            }, function(err){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Failed to sign up.</span>",
                    okType: "button"
                });
            });
        };

        $scope.timeSlotCancel = function(timeSlotId, dateTaskObjIdx, timeSlotObjIdx){
            TaskService.timeSlotCancel(timeSlotId)
            .then(function(){
                $scope.$apply(function(){
                    var dateTaskObj = $scope.dateTaskObjArr[dateTaskObjIdx];
                    var timeSlotObj = dateTaskObj.timeSlotObjArr[timeSlotObjIdx];
                    removeSelfFromAssigneeArr(timeSlotObj.assigneeArr);
                    var assigneeStr = buildAssigneeStr(timeSlotObj.assigneeArr);
                    timeSlotObj.assigneeStr = assigneeStr;
                    timeSlotObj.numAssignees -= 1;
                    timeSlotObj.hasSignedUp = false;
                });
                // $ionicPopup.alert({
                //     title: "Cancel success!",
                //     okType: "button"
                // });
            }, function(err){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Failed to cancel.</span>",
                    okType: "button"
                });
            });
        };

        $scope.refresh = function(){
            TaskService.getTask(taskId).then(function(taskObj){
                $scope.$apply(function(){
                    updateTask($scope, taskObj);
                });
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.genCollection = function(n){
            return new Array(n);
        };
    }
]);