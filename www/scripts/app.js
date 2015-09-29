'use strict';
angular.module('starter', ['ionic','language','controllers','config','LocalStorageModule'])

.run(function($ionicPlatform) { 
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) { 
      StatusBar.styleDefault();
    }
   
  });
}).config(function($urlRouterProvider, $stateProvider,localStorageServiceProvider){
        
    localStorageServiceProvider.setPrefix('clouduino');
    
    
    $stateProvider
        .state('index', {  
            url: '/devices',
            templateUrl: "templates/devices.html",
            controller: 'DevicesTabController'
        }).state('config', {
            url: '/config',
            templateUrl: "templates/config.html",
            controller: 'ConfigTabController'
 
        })
    $urlRouterProvider.otherwise("/devices");
});
