app.controller("CreateNewsCtrl",
    ["$scope", "NewsService", "ImageService", "$ionicPopup", "$state", "$ionicLoading",
    function($scope, NewsService, ImageService, $ionicPopup, $state, $ionicLoading){
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
            if ($scope.newsForm.title === "" ||
                $scope.newsForm.description === "" ||
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
            $ionicLoading.show({
                template: "<span>Uploading Image</span>"
            });
            // valid input
            NewsService.createNews($scope.newsForm, $scope.imgData)
            .then(function(){
                console.log("Successfully created news");
                $ionicLoading.hide();
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
            if (this.files.length === 0){
                return;
            }
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
}]);