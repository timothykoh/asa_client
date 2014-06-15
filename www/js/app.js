// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state("news", {
        url: "/news",
        views: {
            "news-tab" : {
                templateUrl: "templates/news.html",
                controller: "NewsCtrl"
            }
        }
    })
    .state("events", {
        url: "/events",
        views: {
           "events-tab" : { 
                templateUrl: "templates/events.html",
                controller: "EventsCtrl"
            }
       },
    })
    .state("create-event",{
        url: "/create-event",
        views: {
            "events-tab" : {
                templateUrl: "templates/create-event.html",
                controller: "CreateEventsCtrl"
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
});

app.run(function($ionicPlatform) {
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
});