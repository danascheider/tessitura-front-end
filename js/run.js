require('./tessitura.js');

var test = require('./apiOptions.js').useTestRouter;

global.Router = test === true ? new Tessitura.TestRouter() : new Tessitura.Router();
Backbone.history.start();