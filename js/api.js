var test    = require('./apiOptions.js').useTestAPI;
var BaseURL = test ? 'http://api.canto-test.com:3000' : 'https://api.tessitura.io';

var API = {
  base          : BaseURL,
  login         : BaseURL + '/login',
  users         : {
    root           : BaseURL + '/users',
    collection     : BaseURL + '/users',
    single         : function(uid) { return BaseURL + '/users/' + uid; },
  },
  tasks         : {
    root           : BaseURL + '/tasks',
    collection     : function(uid) { return BaseURL + '/users/' + uid + '/tasks'; },
    fullCollection : function(uid) { return BaseURL + '/users/' + uid + '/tasks/all'; },
    single         : function(taskID) { return BaseURL + '/tasks/' + taskID; }
  },
  fachs         : {
    root           : BaseURL + '/fachs',
    collection     : BaseURL + '/fachs',
    single         : function(fachID) { return BaseURL + '/fachs/' + fachID; }
  },
  organizations : {
    root           : BaseURL + '/organizations',
    collection     : BaseURL + '/organizations',
    single         : function(organizationID) { return BaseURL + '/organizations/' + organizationID; }
  }
};

module.exports = API;
