require('./tessitura.js');

global.Router = new Tessitura.TestRouter();
Backbone.history.start();