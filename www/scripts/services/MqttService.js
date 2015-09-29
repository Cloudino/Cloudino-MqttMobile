'use strict';

angular.module('services', ['ionic'])
    .service('Mqtt',function(){
    var client = null; 
    var callback;
   
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        callback(message);
    }

    this.login = function (host,port,user,pass,success,error){
        console.log("inicio")
        client = new Paho.MQTT.Client(host, port,"client_id"); 
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        client.connect({
            useSSL: true,
            userName: user,
            password: pass,
            onSuccess:success,
            onFailure:error,
            timeout:10
        });
    } 

    this.onMessage = function(call){
        callback = call;
    }

    this.isConnected = function(){
        if(client)
            return true
        else
            return false 
    }

    this.subscribeTopic = function(topic){
    client.subscribe(topic);
    }

    this.unSubscribeTopic = function(topic){
    client.unsubscribe(topic);
    }

    this.sendMessage = function(topic,msg){
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message); 
    }
    })
    .directive('removeSpace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if(inputValue == undefined) inputValue = '';
                    var removeSpace = inputValue.replace(/ /g,'_');
                    if(removeSpace !== inputValue) {
                        modelCtrl.$setViewValue(removeSpace);
                        modelCtrl.$render();
                    }         
                    return removeSpace;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]);  // capitalize initial value
            }
        };
});