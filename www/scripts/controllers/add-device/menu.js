'use strict';
angular.module('controllers.addDeviceMenu', ['ionic','services'])
    .controller('AddDeviceMenuController',function($scope,Mqtt,localStorageService,$ionicSideMenuDelegate){
    $scope.addDevice = function(){
        alert("wi");
    }    
});