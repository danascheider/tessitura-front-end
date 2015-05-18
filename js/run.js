require('./tessitura.js');

var test = require('./apiOptions.js').useTestRouter;

global.Router = test ? new Tessitura.TestRouter() : new Tessitura.Router();
Backbone.history.start();