requirejs.config({
  paths: {
    jquery     : './lib/jquery-2.1.1',
    underscore : './lib/underscore',
    backbone   : './lib/backbone',
    relational : './lib/backbone-relational',
    cookie     : './lib/cookie',
    storage    : './lib/backbone.localStorage-min',
    bootstrap  : './lib/bootstrap',
    text       : './lib/text',
    templates  : '../templates',
    styles     : '../css'
  },

  map: {
    '*': {
      css: './lib/css.min'
    }
  }

  shim: {
    bootstrap  : ['jquery'],
  }
});

require(['canto'], function(Canto) {
  Canto.initialize();
  Canto.start();
});