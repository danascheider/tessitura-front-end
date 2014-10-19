requirejs.config({
  paths: {
    jquery    : './lib/jquery-2.1.1',
    underscore: './lib/underscore',
    backbone  : './lib/backbone',
    relational: './lib/backbone-relational',
    storage   : './lib/backbone.localStorage-min'
  }
});

require(['canto'], function(Canto) {
  Canto.initialize();
});