app.controller("CreateEventCtrl", 
    ["$scope", "EventService", "ImageService", "$ionicPopup", "$timeout", "$state", "$ionicLoading",
    function($scope, EventService, ImageService, $ionicPopup, $timeout, $state, $ionicLoading){
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
            console.log($scope.eventForm.budget);
            if ($scope.eventForm.name === "" ||
                $scope.eventForm.description === "" ||
                $scope.eventForm.date === "" ||
                $scope.eventForm.location === "" ||
                $scope.eventForm.budget === "" ||
                $scope.imgData === undefined){
                $ionicPopup.show({
                    title: "<span class='red-text'>All fields are required.</span>",
                    buttons: [
                        {
                            text: "Okay"
                        }
                    ]
                });
                return;
            }
            if (isNaN($scope.eventForm.budget)){
                $ionicPopup.show({
                   title: "<span class='red-text'>Budget has to be numeric.</span>",
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
            if (this.files.length === 0){
                return;
            }
            $ionicLoading.show({
                template: "<span>Loading Image</span>"
            });
            var file = this.files[0];
            ImageService.generateDataUrlFromFile(file, 1280, 720)
            .then(function(dataUrl){
                $scope.$apply(function(){
                    $scope.displayImgSrc = dataUrl;
                    $scope.imgData = dataUrl;
                    $ionicLoading.hide();
                });
            });
        };
    }]
);