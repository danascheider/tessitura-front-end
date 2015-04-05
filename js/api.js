var options = require('./apiOptions.js');
var BaseURL = options.test === true ? 'http://private-6f87dc-canto.apiary-mock.com' : 'http://localhost:9292';

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

module.exports = API;