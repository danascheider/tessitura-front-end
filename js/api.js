define(function() {

  var BaseURL = 'http://private-6f87dc-canto.apiary-mock.com';

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

  return API;
});