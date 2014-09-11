// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);
app.constant("$ionicLoadingConfig",{
    template: "<i class='loading-icon ion-loading-a'></i>"
});
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider
    .state("news", {
        url: "/news",
        views: {
            "news-tab" : {
                templateUrl: "templates/news/news.html",
                controller: "NewsCtrl"
            }
        }
    })
    .state("create-news",{
        url: "/create-news",
        views: {
            "news-tab" : {
                templateUrl: "templates/news/create-news.html",
                controller: "CreateNewsCtrl"
            }
        }
    })
    .state("event-list", {
        url: "/event-list",
        views: {
           "events-tab" : { 
                templateUrl: "templates/events/event-list.html",
                controller: "EventListCtrl"
            }
       }
    })
    .state("event", {
        url: "/event",
        views: {
            "events-tab": {
                templateUrl: "templates/events/event.html",
                controller: "EventCtrl"
            }
        }
    })
    .state("create-event", {
        url: "/create-event",
        views: {
            "events-tab" : {
                templateUrl: "templates/events/create-event.html",
                controller: "CreateEventCtrl"
            }
        }
    })
    .state("profile", {
	   url: "/profile",
	   views: {
            "profile-tab" : {
                templateUrl: "templates/profile.html",
                controller: "ProfileCtrl"
            }
	   }
    });

  $urlRouterProvider.otherwise("news");
  $httpProvider.defaults.withCredentials = true;
}]);



app.run(["$rootScope","$ionicPlatform",function($rootScope, $ionicPlatform) {
    // $rootScope.serverBaseUrl = "http://app.cmuasa.org:3000/";
    // $rootScope.serverBaseUrl = "http://23.92.65.89:3000/";
    // $rootScope.serverBaseUrl = "http://asa.timothykoh.com:3000/";
    $rootScope.serverBaseUrl = "http://localhost:3000/";
    // $rootScope.serverBaseUrl = "http://192.168.1.132:3000/";
    // $rootScope.serverBaseUrl = "http://128.237.205.212:3000/";

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
    });
}]);