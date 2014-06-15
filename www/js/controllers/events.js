function generateEvents(){
    var eventNames = ["IHOP", "Hotpot", "Club Party", "Sushi Sales", "Party at Soul Mart", 
                      "Late Night", "GBM", "Activities Fair", "Steak Pops Sales", "Chill out"];
    var events = [];
    for (var i = 0; i < eventNames.length; i++){
        var year = 14;
        var month = Math.floor(Math.random() * 12) + 1;
        var day = Math.floor(Math.random() * 27) + 1;
        events.push({
            name: eventNames[i],
            date: month + "/" + day + "/" + year
        });
    }
    return events;
}

app.controller("EventsCtrl", function($scope){
    $scope.events = generateEvents();
});
app.controller("CreateEventsCtrl", function($scope, $ionicPopup, $timeout){
    $scope.eventForm = {};

    $scope.tasks = [];

    $scope.deleteTask = function(index){
        $scope.tasks.splice(index,1);
    }

    // handle adding tasks through a pop up
    $scope.task = {};
    $scope.showTaskPopup = function(){
        $ionicPopup.show({
            title: "Task Details",
            templateUrl: "popups/add-task-popup.html",
            scope: $scope,
            buttons: [
                {   text: "Cancel",
                    onTap: function(e){
                        $scope.task = {};
                    }
                },
                {
                    text: "Add",
                    type: "button-positive",
                    onTap: function(e){
                        if ($scope.task.name === undefined || $scope.task.numPeople === undefined){
                            e.preventDefault();
                        } else{
                            var taskObj = {
                                name: $scope.task.name,
                                numPeople: $scope.task.numPeople
                            }
                            // reset $scope.task so the fields will not have values
                            // when the user clicks again
                            $scope.task = {};
                            return taskObj;
                        }
                    }
                }
            ]
        }).then(function(res){
            if (res !== undefined){
                $scope.tasks.push(res);
                console.log($scope.tasks);
            }
        });
    }
});