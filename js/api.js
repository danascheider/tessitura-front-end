/* istanbul ignore next */ var test    = require('./apiOptions.js').useTestAPI;
/* istanbul ignore next */ var BaseURL = test ? 'http://api.canto-test.com:3000' : 'https://api.tessitura.io';

/* istanbul ignore next */
var API = {
  base  : BaseURL,
  login : BaseURL + '/login',
  users : {
    root           : BaseURL + '/users',
    collection     : BaseURL + '/users',
    single         : function(uid) { return BaseURL + '/users/' + uid; },
  },
  tasks : {
    root           : BaseURL + '/tasks',
    collection     : function(uid) { return BaseURL + '/users/' + uid + '/tasks'; },
    fullCollection : function(uid) { return BaseURL + '/users/' + uid + '/tasks/all'; },
    single         : function(taskID) { return BaseURL + '/tasks/' + taskID; }
  },
};

/* istanbul ignore next */ module.exports = API;
