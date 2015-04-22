require('./canto.js');

var test = require('./apiOptions.js').test;

global.Router = test ? new Canto.TestRouter() : new Canto.Router();
Backbone.history.start();