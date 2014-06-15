app.controller("NewsCtrl", function($scope){
    var news1 = {
        title: "GBM",
        date: "08/22/2014",
        thumbnail: "img/tim_photo.jpg",
        img: "img/cmu_uc.jpg",
        details: "GBM this coming wednesday. Come out and meet the freshmen!! We have FREE FOOD too, so don't miss out. \
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, iusto facilis sint fuga aliquid \
                  ex suscipit voluptatum dignissimos est rem accusamus praesentium maiores aut sapiente itaque harum similique \
                  doloremque quisquam."
    };
    var news2 = {
        title: "Hanging out",
        date: "08/21/2014",
        thumbnail: "img/tim_photo.jpg",
        img: "img/oe_food.jpg",
        details: "A bunch of us are grabbing lunch at OE today. Feel free to join us!!\
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam, qui, \
                  libero reiciendis soluta nemo corporis deleniti mollitia error nihil consequatur \
                  sint dolorem vero omnis totam excepturi magni iusto vel doloribus."
    }
    $scope.newsList = [news1, news2];
});