require('./tessitura.js');

var test = require('./apiOptions.js').useTestRouter;

global.Router = new Tessitura.TestRouter();
Backbone.history.start();