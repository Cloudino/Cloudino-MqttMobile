'use strict';
angular.module('controllers.addDeviceButton', ['ionic','services'])
    .controller('AddDeviceButtonController',function($scope,localStorageService,$state){
        $scope.saveButton = function(text,topic,msgOn,msgOff){
            var devices = JSON.parse(localStorageService.get("devices"));
            var newDevice = new Object();
            newDevice.type = "button";
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.msgOn = msgOn;
            newDevice.msgOff = msgOff;
            devices.push(newDevice);
            localStorageService.set("devices",JSON.stringify(devices));
            $state.go("");
        }
});