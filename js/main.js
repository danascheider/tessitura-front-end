requirejs.config({
  paths: {
    jquery     : './lib/jquery-2.1.1',
    underscore : './lib/underscore',
    backbone   : './lib/backbone',
    relational : './lib/backbone-relational',
    cookie     : './lib/jquery.cookie-1.4.1.min',
    storage    : './lib/backbone.localStorage-min',
    bootstrap  : './lib/bootstrap'
  },

  shim: {
    bootstrap  : ['jquery'],
    'sb-admin' : ['jquery', 'bootstrap']
  }
});

require(['canto'], function(Canto) {
  Canto.initialize();
  Canto.start();
});