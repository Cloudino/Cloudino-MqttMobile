'use strict';
angular.module('controllers.config', ['ionic','services'])
    .controller('ConfigTabController', function($scope,Mqtt,localStorageService,$ionicLoading,$ionicPopup){
    
        $scope.server = localStorageService.get("config.server") || "";
        $scope.port = parseInt(localStorageService.get("config.port")) || "";
        $scope.user = localStorageService.get("config.user") || "";
        $scope.pass = localStorageService.get("config.pass") || "";
        
        $scope.testConexion = function(server,port,user,pass){
            $scope.server = server;
            $scope.port = port; 
            $scope.user = user; 
            $scope.pass = pass; 
            $ionicLoading.show({
                template: 'Conectando...'
            });
            try{
            Mqtt.login(server,port,user,pass,
               function(msg){ //On connect
                    $ionicLoading.hide();
                    localStorageService.set("config.server", $scope.server)
                    localStorageService.set("config.port", $scope.port)
                    localStorageService.set("config.user", $scope.user)
                    localStorageService.set("config.pass", $scope.pass)
                    localStorageService.set("config.ready", true)
            
                    console.log(msg)
                    $ionicPopup.alert({
                        title: 'Conectado',
                        template: 'Conectado con exito'
                   });
                },function(err){ // On error
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Verifica la configuracion de conexion'
                   });
                });   
            }catch(err){
                 $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: err
                   });
                
            }  
        };
        
      /*  Mqtt.onMessage(function(message){
            console.log("onMessageArrived:"+message.payloadString);
            $scope.messages.push(message.payloadString);
            $scope.$apply();
        })
        
        $scope.enviarMensaje = function(msg){
            Mqtt.sendMessage(msg);
            $scope.msg = ""
        };
        */
});