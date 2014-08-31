app.controller("CreateNewsCtrl",
    ["$scope", "NewsService", "ImageService", "$ionicPopup", "$state",
    function($scope, NewsService, ImageService, $ionicPopup, $state){
        $scope.newsForm = {
            title: "",
            description: ""
        };

        $scope.displayImgSrc = undefined;
        $scope.imgData = undefined;

        $scope.imageUpload = function(){
            console.log("AA");
        };

        $scope.create = function(){
            console.log("CREATING");
            if ($scope.newsForm.title === "" || $scope.newsForm.description === ""){
                $ionicPopup.show({
                    title: "Please fill in the <span class='red-text'>Title</span> " +
                            "and the <span class='red-text'>Description</span>",
                    buttons: [
                        {
                            text: "Okay"
                        }
                    ]
                });
                return;
            }

            // valid input
            NewsService.createNews($scope.newsForm, $scope.imgData)
            .then(function(){
                console.log("Successfully created news");
                $ionicPopup.show({
                    title: "News created",
                    buttons: [
                        {
                            text: "Okay",
                            onTap: function(){
                                $state.go("news");
                            }
                        }
                    ]
                });
            }, function(){
                $ionicPopup.show({
                    title: "<span class='red-text'>Failed to create news.</span>",
                    buttons: [
                        {
                            text: "Okay"
                        }
                    ]
                });
                console.log("Failed to create news");
            });
        };

        // handle image upload
        var imageInputElem = document.getElementById("image-input");
        imageInputElem.addEventListener("change", handleFiles, false);
        function handleFiles(){
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                $scope.$apply(function(){
                    $scope.displayImgSrc = e.target.result;
                });
                reader.onload = function(e){
                    $scope.imgData = e.target.result;
                }
                reader.readAsBinaryString(file);
            };
            reader.readAsDataURL(file);
        };
}]);