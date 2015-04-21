require('./canto.js');

global.Router = new Canto.TestRouter();
Backbone.history.start();