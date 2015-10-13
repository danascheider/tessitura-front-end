require('./tessitura.js');

global.Router = new Tessitura.Router();
Backbone.history.start({pushState: true});