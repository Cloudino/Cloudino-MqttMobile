'use strict';
angular.module('controllers.device', ['ionic','services','config','ngCordova','pascalprecht.translate'])
    .controller('DevicesTabController',function($scope,Mqtt,localStorageService,$ionicModal,$ionicPopup,
                                                $cordovaVibration,$ionicActionSheet,$translate,$ionicPopover,
                                                 $ionicLoading,$timeout,$state,$ionicPlatform,$ionicHistory){
    
    //Verifica la pulsacion del boton atras en android, para cerrar 
    $ionicPlatform.registerBackButtonAction(function(e) {
       if($state.current.name=="index") {
           if( $scope.canReorder ||  $scope.canDelete ){
                $scope.canDelete = false;
                $scope.canReorder = false;
                $scope.$digest()
            }else{
                 ionic.Platform.exitApp();
            }
        }else{
            console.log("settings")
            $ionicHistory.goBack();
        }
       
        
    }, 101);
    
    if(localStorageService.get("config.ready")){
        try{    
            $ionicLoading.show({
                template: 'Conectando...'
            });
            Mqtt.login(localStorageService.get("config.server"),localStorageService.get("config.port"),
                       localStorageService.get("config.user"),localStorageService.get("config.pass"),
                        function(msg){ //On connect
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: 'Conectando con exito.'
                            });            
                            $timeout(function(){
                                $ionicLoading.hide();
                            },1000)     
                           
                            //Escucho por nuevos mensajes
                            Mqtt.onMessage(function(message){
                                $scope.devices.forEach(function(device,i){
                                    if(device.type == "label"){
                                        if(device.topic == message.destinationName){
                                            $scope.devices[i].msg = message.payloadString;
                                            localStorageService.set("devices",JSON.stringify($scope.devices));
                                        }
                                    }
                                 })
                                $scope.$digest()
                            });
                            //Subscribo todos los label
                            $scope.devices.forEach(function(device,i){
                                if(device.type == "label"){
                                     Mqtt.subscribeTopic(device.topic);
                                    
                                }
                             })

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
    }  
    
    
    if(!JSON.parse(localStorageService.get("devices"))){
        localStorageService.set("devices",JSON.stringify(new Array()));
        $scope.devices = [];
    }else{
        $scope.devices = JSON.parse(localStorageService.get("devices"));
    }
   
    $scope.canReorder = false;
    $scope.canDelete = false;
    $scope.canEdit = true;
    $scope.textSend = "";
    $scope.selectList = [];
    
    $scope.reorderItem = function(device, fromIndex, toIndex) {
        $scope.devices.splice(fromIndex, 1);
        $scope.devices.splice(toIndex, 0, device);
        $scope.$apply;
        localStorageService.set("devices",JSON.stringify($scope.devices));

    };
    
    $scope.removeItem = function(index) {
        var confirmPopup = $ionicPopup.confirm({
            template: "{{'DELETE_MSG' | translate }}"
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.devices.splice(index, 1);
                $scope.$apply;
                localStorageService.set("devices",JSON.stringify($scope.devices));
             } 
        });
    };
    
    $scope.editItem = function(i,device){
        $scope.canReorder = false;
        $scope.canDelete = false;
        if(device.type =="button"){
             $scope.openAddDeviceButton(i,device);
        }else if(device.type =="toggle"){
            $scope.openAddDeviceToggle(i,device);
        }else if(device.type =="slider"){
             $scope.openAddDeviceSlider(i,device);
        }else if(device.type =="text"){
             $scope.openAddDeviceText(i,device);
        }else if(device.type =="select"){
             $scope.openAddDeviceSelect(i,device);
        }else if(device.type =="title"){
             $scope.openAddTitle(i,device);
        }else if(device.type =="label"){
             $scope.openAddLabel(i,device);
        }
        
    }
    
    

    
//Create modal addDevices
    //Add menu
   $ionicModal.fromTemplateUrl('templates/add-device/add-device-menu.html', {
        scope: $scope,
        animation: 'slide-in-up'  
    }).then(function(modal) {
        $scope.addMenu =   modal;
    });
    
    $scope.openAddDeviceMenu = function(){
        $scope.canReorder = false;
        $scope.canDelete = false;
        $scope.menuDevices.hide()
        $scope.addMenu.show();
    }
       
    
    $scope.displayMenu = function(e){
        $translate(['EDIT', 'REORDER', 'DELETE','ACTION.TITLE','CANCEL']).then(function (t) {
           //if (ionic.Platform.isAndroid()) {
                $ionicPopover.fromTemplateUrl('templates/add-device/menu-device.html', {
                    scope: $scope
                }).then(function(popover) {
                    $scope.menuDevices = popover;
                    $scope.menuDevices.show(e);
                });
            /*}else{
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: t.EDIT },
                        { text: t.REORDER}
                    ],
                    destructiveText: t.DELETE,
                    titleText: t['ACTION.TITLE'],
                    cancelText: t.CANCEL,
                    buttonClicked: function(index) {
                        if(index == 1)
                            $scope.canReorder = true;
                        return true;
                    }
                });
            }*/
        });
    }
    
    $scope.onReorder = function(){
        $scope.canReorder = true;
        $scope.canDelete = false;
        $scope.menuDevices.remove();
    } 
    $scope.onDelete = function(){
        $scope.canDelete = true;
        $scope.canReorder = false;
        $scope.menuDevices.remove();
    }
    $scope.onConfig = function(){
        $state.go("config");
        $scope.menuDevices.remove();
    }
    
    $scope.sendMsg = function(topic,msg){
        console.log(topic+"/"+msg)
        localStorageService.set("devices",JSON.stringify($scope.devices));
        if( Mqtt.isConnected()){
            Mqtt.sendMessage(topic,msg);
        }else{
             $ionicLoading.show({
                template: 'Error de conexion, verfica la configuracion'
            });            
            $timeout(function(){
                $ionicLoading.hide();
            },1000)      
        }
    }
     /*     Add title   */
    $scope.openAddTitle = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-title.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addMenuTitle =   modal;
            $scope.addMenuTitle.show();
        });
    }
     /*     Add label   */
     $scope.openAddLabel = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.topic = device.topic; 
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
            $scope.topic = ""; 
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-label.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addMenuLabel =   modal;
            $scope.addMenuLabel.show();
        });
    }
    /*     Add button   */
    $scope.openAddDeviceButton = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.buttonText = device.buttonText;
            $scope.topic = device.topic; 
            $scope.msgOn = device.msgOn;
            $scope.msgOff = device.msgOff;
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.buttonText = "Push"
            $scope.msgOn = "on"
            $scope.msgOff = "off"
            $scope.isEditing = false;
            $scope.text = ""; 
            $scope.topic = ""; 
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-button.html', {
            scope: $scope,
            animation: 'slide-in-up' 
        }).then(function(modal) {
            $scope.addMenuButton =   modal;
            $scope.addMenuButton.show();
        });
    }
    $scope.onTextButtonChange = function(text){
        if(!$scope.isEditing){
            if(text){
                $scope.topic = "/"+text.replace(/ /g,'_').toLowerCase();
            }else{
                $scope.topic = "/"
            }
        }
    }
    
    
    /*     Add Toggle   */
    $scope.openAddDeviceToggle  = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.topic = device.topic; 
            $scope.msgOn = device.msgOn;
            $scope.msgOff = device.msgOff;
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
            $scope.topic = ""; 
            $scope.msgOn = "on"
            $scope.msgOff = "off"
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-toggle.html', {
            scope: $scope,
            animation: 'slide-in-up' 
        }).then(function(modal) {
            $scope.addMenuToggle = modal;
            $scope.addMenuToggle.show();
        });
    }
   
    $scope.onToggleChange = function(i,value,topic){
        var msg = ""
        if(value){
            msg = $scope.devices[i].msgOn;
        }
        else{
            msg = $scope.devices[i].msgOff;
        }
        $scope.sendMsg(topic,msg);
        //localStorageService.set("devices",JSON.stringify($scope.devices));
        
    }
  /*     Add Slider   */
    $scope.openAddDeviceSlider = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.topic = device.topic; 
            $scope.minValue = device.min;
            $scope.maxValue = device.max;
            $scope.stepValue = device.step
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
            $scope.topic = ""; 
            $scope.minValue = 0;
            $scope.maxValue = 100;
            $scope.stepValue = 5;
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-slider.html', {
            scope: $scope,
            animation: 'slide-in-up' 
        }).then(function(modal) {
            $scope.addMenuSlider = modal;
            $scope.addMenuSlider.show();
        });
    }
     /*     Add Text   */
    $scope.openAddDeviceText = function(i,device){
        if(device){
            $scope.text = device.text;
            $scope.topic = device.topic; 
            $scope.msgOn = device.msgOn;
            $scope.msgOff = device.msgOff;
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
            $scope.topic = ""; 
        }
            
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-text.html', {
            scope: $scope,
            animation: 'slide-in-up' 
        }).then(function(modal) {
            $scope.addMenuText = modal;
            $scope.addMenuText.show();
        });
    }
     /*     Add Select   */
    $scope.openAddDeviceSelect = function(i,device){
         if(device){
            $scope.text = device.text;
            $scope.topic = device.topic;
            $scope.selectList = device.list;
            $scope.isEditing = true;
            $scope.indexEdit = i;
        }else{
            $scope.text = "";
            $scope.topic = ""; 
        }
        $ionicModal.fromTemplateUrl('templates/add-device/add-device-select.html', {
            scope: $scope,
            animation: 'slide-in-up' 
        }).then(function(modal) {
            $scope.addMenuSelect = modal;
            $scope.addMenuSelect.show();
        });
    }
    
    $scope.addSelectMsg = function(msg){
        $scope.selectList.push(msg)
    }
    
//Add devices
    //Add Button
    $scope.saveButton = function(text,buttonText,topic,msgOn,msgOff){
        if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].buttonText = buttonText;
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].msgOn = msgOn;
            $scope.devices[ $scope.indexEdit].msgOff = msgOff;
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "button";
            newDevice.text = text;
            newDevice.buttonText = buttonText;
            newDevice.topic = topic; 
            newDevice.msgOn = msgOn;
            newDevice.msgOff = msgOff;
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false; 
        localStorageService.set("devices",JSON.stringify($scope.devices));
        $scope.addMenu.hide();
        $scope.addMenuButton.remove();
        $ionicLoading.hide();
        $ionicLoading.show({
           template: "{{'ADD_BUTTON.ADD_BUTTON_OK' | translate }}"
        });            
        $timeout(function(){
            $ionicLoading.hide();
        },1500)     
    }
    //Add Toggle 
    $scope.saveToggle = function(text,topic,msgOn,msgOff){
         if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].msgOn = msgOn;
            $scope.devices[ $scope.indexEdit].msgOff = msgOff;
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "toggle";
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.msgOn = msgOn;
            newDevice.msgOff = msgOff;
            newDevice.actualPos = false;
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify($scope.devices));
         
        $scope.addMenu.hide();
        $scope.addMenuToggle.remove();  
        $ionicLoading.hide();
        $ionicLoading.show({
           template: "{{'ADD_TOGGLE.ADD_TOGGLE_OK' | translate }}"
        });            
        $timeout(function(){
            $ionicLoading.hide();
        },1500)   
        
 };
    
     $scope.saveSlider = function(text,topic,minValue,maxValue,stepValue){
         if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].min = minValue;
            $scope.devices[ $scope.indexEdit].max = maxValue;
             $scope.devices[ $scope.indexEdit].step = stepValue;
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "slider";
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.min = minValue;
            newDevice.max = maxValue;
            newDevice.actualPos = 0;
            newDevice.step = stepValue;
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify($scope.devices));
         
         $scope.addMenu.hide();
         $scope.addMenuSlider.remove(); 
         $ionicLoading.show({
            template: "{{'ADD_SLIDER.ADD_SLIDER_OK' | translate }}"
         });            
         $timeout(function(){
             $ionicLoading.hide();
         },1500)   
        
    }
     
    $scope.saveText = function(text,topic){
        if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "text";
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify( $scope.devices));
        
        $scope.addMenu.hide();
        $scope.addMenuText.remove();  
        $ionicLoading.hide();
         $ionicLoading.show({
             template: "{{'ADD_TEXT.ADD_TEXT_OK' | translate }}"
         });            
         $timeout(function(){
             $ionicLoading.hide();
         },1500)   
        
       
    }
    
    $scope.saveSelect = function(text,topic){
         if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].list = $scope.selectList;
            $scope.devices[ $scope.indexEdit].actualPos = $scope.selectList[0];
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "select"; 
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.list = $scope.selectList;
            newDevice.actualPos = newDevice.list[0];
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify($scope.devices));
        
        $scope.selectList = [];
        $scope.addMenu.hide();
        $scope.addMenuSelect.remove();   
        $ionicLoading.hide();
          $ionicLoading.show({
           template: "{{'ADD_SELECT.ADD_SELECT_OK' | translate }}"
         });            
         $timeout(function(){
             $ionicLoading.hide();
         },1500)   
         
    }
    
    $scope.saveTitle = function(text){
        if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            newDevice.type = "title";
            newDevice.text = text;
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify($scope.devices));
        
        $scope.addMenu.hide();
        $scope.addMenuTitle.remove();
         $ionicLoading.hide();
        $ionicLoading.show({
            template: "{{'ADD_TITLE.ADD_TITLE_OK' | translate }}"
        });            
        $timeout(function(){
            $ionicLoading.hide();
        },1500)   
        
       
    }
    $scope.saveLabel = function(text,topic){
        if($scope.isEditing){
            $scope.devices[ $scope.indexEdit].text = text;
            Mqtt.unSubscribeTopic($scope.devices[ $scope.indexEdit].topic);
            Mqtt.subscribeTopic(topic);
            $scope.devices[ $scope.indexEdit].topic = topic; 
            $scope.devices[ $scope.indexEdit].dateModify = new Date().getTime();
        }else{
            var newDevice = new Object();
            Mqtt.subscribeTopic(topic);
            newDevice.type = "label";
            newDevice.text = text;
            newDevice.topic = topic;
            newDevice.msg = "";
            newDevice.dateCreated = new Date().getTime();
            $scope.devices.push(newDevice);
        }
        $scope.isEditing = false;
        localStorageService.set("devices",JSON.stringify($scope.devices));
        $scope.addMenu.hide();
        $scope.addMenuLabel.remove();
        $ionicLoading.hide();
        $ionicLoading.show({
             template: "{{'ADD_TITLE.ADD_TITLE_OK' | translate }}"
        });            
        $timeout(function(){
            $ionicLoading.hide();
        },1500)   
    }

});