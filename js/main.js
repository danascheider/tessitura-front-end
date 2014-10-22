requirejs.config({
  paths: {
    jquery      : './lib/jquery-2.1.1',
    underscore  : './lib/underscore',
    backbone    : './lib/backbone',
    relational  : './lib/backbone-relational',
    cookie      : './lib/cookie',
    storage     : './lib/backbone.localStorage-min',
    bootstrap   : './lib/bootstrap',
    text        : './lib/text',
    css         : './lib/css.min',
    templates   : '../templates',
    stylesheets : '../css',
    'fa-styles' : '../font-awesome/css'
  },

  shim: {
    bootstrap  : ['jquery'],
  }
});

require(['canto'], function(Canto) {
  Canto.initialize();
  $(function() {
    Canto.start();
  });
});