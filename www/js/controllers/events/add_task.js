
app.controller("EventAddTaskCtrl",
    ["$scope",
     "TaskService",
     "EventService",
     "$ionicPopup",
     "$state",
     "$ionicGesture",
     "$location",
    function($scope,
             TaskService,
             EventService,
             $ionicPopup,
             $state,
             $ionicGesture,
             $location){
        function getDateArr(startDateObj, n){
            var dateArr = [];
            var secsInDay = 86400000;
            for (var i = 0; i < n; i++){
                var dateObj = new Date(startDateObj.getTime() + i * secsInDay);
                var dateStr = (dateObj.getUTCMonth() + 1)  + "/" + dateObj.getUTCDate() + "/" + dateObj.getUTCFullYear();
                dateArr.push(dateStr);
            }
            return dateArr;
        }

        function genTimeslotArr(start, end, timeSlotDuration){
            var timeSlotsPerHour = 60/timeSlotDuration;
            var timeSlotArr = new Array((end - start + 1)*timeSlotsPerHour);
            for (var i = start; i <= end; i++){
                for (var j = 0; j < timeSlotsPerHour; j++){
                    var hour = i;
                    var minutes = ("0" + j*timeSlotDuration).slice(-2);
                    var timeSlot = hour + ":" + minutes;
                    timeSlotArr[i*timeSlotsPerHour - start + j] = timeSlot;
                }
            }
            return timeSlotArr;
        }

        $scope.eventObj = EventService.getCurrentEvent();
        if ($scope.eventObj === undefined){
            var eventId = $location.search().id;
            if (eventId === undefined){
                $state.go("event-list");
                return;
            }
            EventService.getEvent(eventId).then(function(eventObj){
                $scope.$apply(function(){
                    $scope.eventObj = eventObj;
                });
                EventService.updateCurrentEvent(eventObj);
            }, function(){
                $state.go("event-list");
            });
        }

        var TIME_START = 0;
        var TIME_END = 23;
        var TIMESLOT_DURATION = 30;
        var COL_WIDTH = 105;
        var HDR_COL_WIDTH = 50;
        $scope.timeSlots = genTimeslotArr(TIME_START, TIME_END, TIMESLOT_DURATION);

        $scope.taskForm = {
            name: "",
            date: ""
        };

        $scope.timeSlotMap = {};

        function reloadCalendar(){
            var numCols = Math.floor((window.innerWidth - HDR_COL_WIDTH)/COL_WIDTH);
            var dateObj =  new Date($scope.taskForm.date);
            $scope.dateArr = getDateArr(dateObj, numCols);
            for (var i = 0; i < $scope.dateArr.length; i++){
                var date = $scope.dateArr[i];
                if ($scope.timeSlotMap[date] === undefined){
                    $scope.timeSlotMap[date] = {};
                }
            }
        };

        $scope.dateChange = reloadCalendar;
        window.onresize = function(){
            $scope.$apply(reloadCalendar);
        };

        var timeSlotPopup;
        $scope.cellSelected = function(date, timeSlot){
            timeSlotPopup = $ionicPopup.show({
                title: "How many people are required for task on " +
                       "<span class='red-text'>" + date + "</span> at " +
                       "<span class='red-text'>" + timeSlot + "</span>?",
                templateUrl: "popups/task-timeslot-popup.html",
                scope: $scope,
                buttons: [
                    {
                        text: "Cancel",
                        type: "button-positive"
                    }
                ]
            });
            $scope.setNumPeople = function(numPeople){
                if (numPeople === undefined || numPeople === null){
                    return;
                }
                $scope.timeSlotMap[date][timeSlot] = numPeople;
                timeSlotPopup.close();
            };
        };

        $scope.cellClicked = function(date,timeSlot){
            var oldVal = $scope.timeSlotMap[date][timeSlot];
            if (oldVal === undefined){
                oldVal = 0;
            }
            $scope.timeSlotMap[date][timeSlot] = oldVal + 1;
        }
        
        $scope.add = function(){
            if ($scope.eventObj === undefined){
                $ionicPopup.alert({
                    template: "No event associated with this task. Select the event before adding the task.",
                    okType: "button"
                });
                return;   
            }
            if ($scope.taskForm.name === ""){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Task Name</span> is required.",
                    okType: "button"
                });
                return;
            }
            var taskDetails = {
                name: $scope.taskForm.name,
                timeSlotMap: $scope.timeSlotMap
            };
            TaskService.createTask(taskDetails, $scope.eventObj.event_id)
            .then(function(){
                $ionicPopup.alert({
                    title: "Task Created",
                    okType: "button"
                }).then(function(){
                    $location.url("event?id=" + $scope.eventObj.event_id);
                });
            }, function(err){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Failed to create task.</span>",
                    okType: "button"
                });
            });
        };

        $scope.back = function(){
            if ($scope.eventObj !== undefined){
                $location.url("event?id=" + $scope.eventObj.event_id);
            } else{
                $scope.go("event-list");
            }
        }

        $ionicGesture.on('hold', function(event){
            var path = event.path;
            for (var i = 0; i < path.length; i++){
                var classList = path[i].classList;
                if (classList !== undefined && classList.contains("cell")){
                    var cellElem = path[i];
                    break;
                }
            }
            if (cellElem === undefined){
                return;
            }
            var date = cellElem.dataset.date;
            var timeSlot = cellElem.dataset.timeslot;
            $scope.cellSelected(date, timeSlot);
        }, angular.element(document.querySelector(".task-calendar")));
}]);