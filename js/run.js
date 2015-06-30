/* istanbul ignore next */ require('./tessitura.js');

/* istanbul ignore next */ global.Router = new Tessitura.Router();
/* istanbul ignore next */ Backbone.history.start();