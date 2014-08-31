app.controller("CreateEventCtrl", 
    ["$scope", "EventService", "$ionicPopup", "$timeout", "$state", "$ionicLoading",
    function($scope, EventService, $ionicPopup, $timeout, $state, $ionicLoading){
        $scope.eventForm = {
            name: "",
            description: "",
            date: "",
            location: "",
            budget: ""
        };

        $scope.tasks = [];
        $scope.displayImgSrc = undefined;
        $scope.imgData = undefined;

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
        };

        $scope.create = function(e){
            if ($scope.eventForm.name === ""){
                $ionicPopup.show({
                    title: "Please fill in the <span class='red-text'>Event Name</span>.",
                    buttons: [
                        {
                            text: "Okay"
                        }
                    ]
                });
                return;
            }
            $ionicLoading.show({
                template: "<span>Uploading Image</span>"
            });
            setTimeout(function(){
                EventService.createEvent($scope.eventForm, $scope.imgData, $scope.tasks)
                .then(function(){
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: "Event created",
                        buttons: [
                            {
                                text: "Okay",
                                onTap: function(){
                                    $state.go("event-list");
                                }
                            }
                        ]
                    });
                }, function(){
                    $ionicPopup.show({
                        title: "<span class='red-text'>Failed to create event.</span>",
                        buttons: [
                            {
                                text: "Okay"
                            }
                        ]
                    });
                });
            }, 0);
        };
        // handle image upload
        var imageInputElem = document.getElementById("image-input");
        imageInputElem.addEventListener("change", handleFiles, false);
        function handleFiles(){
            $ionicLoading.show({
                template: "<span>Loading Image</span>"
            });
            var file = this.files[0];
            setTimeout(function(){
                var reader = new FileReader();
                reader.onload = function(e){
                    $scope.$apply(function(){
                        $scope.displayImgSrc = e.target.result;
                        $ionicLoading.hide();
                    });
                    reader.onload = function(e){
                        $scope.imgData = e.target.result;
                    }
                    reader.readAsBinaryString(file);
                };
                reader.readAsDataURL(file);
            }, 0);
        };
    }]
);