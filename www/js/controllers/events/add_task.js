
app.controller("EventAddTaskCtrl",
    ["$scope", "TaskService", "EventService", "$ionicPopup", "$state",
    function($scope, TaskService, EventService, $ionicPopup, $state){
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

        var eventObj = EventService.getCurrentEvent();
        if (eventObj === undefined){
            $state.go("event-list");
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
                scope: $scope
            });
            $scope.setNumPeople = function(numPeople){
                if (numPeople === undefined || numPeople === null){
                    return;
                }
                $scope.timeSlotMap[date][timeSlot] = numPeople;
                timeSlotPopup.close();
            };
        };
        
        $scope.add = function(){
            var eventObj = EventService.getCurrentEvent();
            if (eventObj === undefined){
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
            TaskService.createTask(taskDetails, eventObj.event_id)
            .then(function(){
                $ionicPopup.alert({
                    title: "Task Created",
                    okType: "button"
                }).then(function(){
                    $state.go("event");
                });
            }, function(err){
                $ionicPopup.alert({
                    title: "<span class='red-text'>Failed to create task.</span>",
                    okType: "button"
                });
            });
    }
}]);