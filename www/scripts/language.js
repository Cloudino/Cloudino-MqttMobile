'use strict';
angular.module('language', ['pascalprecht.translate'])
    .config(function($translateProvider){
       
$translateProvider.translations('es', {
    'DEVICES': 'Dispositivos',
    'ADD_MENU.TITLE': 'Seleciona control',
    'ADD_MENU.BUTTON': 'Boton',
    'ADD_MENU.TOGGLE': 'Interruptor',
    'ADD_MENU.SELECT': 'Lista',
    'ADD_MENU.SLIDE': 'Deslizador',
    'ADD_MENU.TEXT': 'Texto',
    'ADD_MENU.TITLE_WRITE' : 'Controles',
    'ADD_MENU.TITLE_SEPARATOR': 'Separadores',
    'ADD_MENU.TITLE_READ':'Monitoreo',
    'ADD_MENU.ADD_TITLE':'Titulo',
    'ADD_MENU.LABEL':'Etiqueta',
    'ADD_MENU.SEPARATOR':'Separador',
    'ADD_BUTTON.TITLE': 'Nuevo boton',
    'ADD_BUTTON.TEXT': 'Texto',
    'ADD_BUTTON.BUTTON_TEXT': 'Texto del boton',
    'ADD_BUTTON.TOPIC': 'Topico',
    'ADD_BUTTON.MSG_ON': 'Mensaje al presionar',
    'ADD_BUTTON.MSG_OFF': 'Mensaje al liberar',
    
    'ADD_SLIDER.TITLE': 'Nuevo deslizador',
    'ADD_SLIDER.TEXT': 'Texto',
    'ADD_SLIDER.TOPIC': 'Topico',
    'ADD_SLIDER.MIN': 'Valor minimo',
    'ADD_SLIDER.MAX': 'Valor maximo',
    'ADD_SLIDER.STEP': 'Intervalo',
    
    'ADD_LABEL.TITLE': 'Nueva etiqueta',
    'ADD_LABEL.TEXT': 'Texto',
    'ADD_LABEL.TOPIC': 'Topico a escuchar',
    
    
    'ADD_TOGGLE.TITLE' :'Nuevo interruptor',
    'ADD_TOGGLE.TEXT': 'Texto',
    'ADD_TOGGLE.TOPIC': 'Topico',
    'ADD_TOGGLE.MSG_ON': 'Mensaje encendido ',
    'ADD_TOGGLE.MSG_OFF': 'Mensaje apagado',
    'ADD_SELECT.TITLE' :'Nueva lista',
    'ADD_SELECT.TEXT': 'Texto',
    'ADD_SELECT.TOPIC': 'Topico',
    'ADD_SELECT.LIST_TITLE': 'Lista de mensajes',
    'ADD_SELECT.ADD_MSG': 'Agregar mensage',
    'ADD_TITLE.TITLE' :'Nueva titulo de categoria',
    'ADD_TITLE.TEXT': 'Texto',
    'DELETE_TITLE':'Eliminar',
    'DELETE_MSG':'¿Estas seguro de eliminar este elemento?',
    'ADD_TEXT.TITLE' :'Nuevo mensaje de texto',
    'ADD_TEXT.TEXT': 'Texto',
    'ADD_TEXT.TOPIC': 'Topico',
    'MESSAGE':'Mensaje',
    'SEND':'Enviar',
    'SAVE': 'Guardar',
    'ADD': 'Agregar',
    'ADDED': 'Agregado',
    'EDIT': 'Editar',
    'REORDER': 'Reordenar',
    'DELETE':'Borrar',
    'ACTION.TITLE':'Editar control',
    'CANCEL':'Cancelar',
    'ADD_BUTTON.ADD_BUTTON_OK' : 'Se guardo el boton correctamente',
    'ADD_TOGGLE.ADD_TOGGLE_OK' : 'Se guardo el interruptor correctamente',
    'ADD_SELECT.ADD_SELECT_OK' : 'Se guardo la lista correctamente',
    'ADD_SLIDER.ADD_SLIDER_OK' : 'Se guardo el deslizador correctamente',
    'ADD_TEXT.ADD_TEXT_OK' : 'Se guardo el mensaje de texto correctamente',
    'ADD_TITLE.ADD_TITLE_OK' : 'Se guardo el titulo correctamente',
    'ADD_LABEL.ADD_LABEL_OK' : 'Se guardo la etiqueta correctamente',
    
    'CONFIGURATION':'Configuración',
    'SERVER':'Servidor',
    'PORT':'Puerto',
    'USER':'Usuario',
    'PASSWORD':'Contraseña',
    'TEST-CONNECTION':'Probar conexión'
    
  });
    
  // register english translation table
  $translateProvider.translations('en', {
    'DEVICES': 'Devices'
  });
  // which language to use?
  $translateProvider.preferredLanguage('es');
});
