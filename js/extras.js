define(['jquery', 'cookie', 'models/session'], function($, Cookie, Session) {
  var extras = {
    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(key in formData) {
        var chiave = formData[key]['name'];
        if(formData[key]['value'] != '') {
          attributes[chiave] = formData[key]['value'];
        }
      }

      return attributes;
    },

    getAuthHash: function(username, password) {
      return btoa(username + ':' + password);
    },

    makeBasicAuth: function(username, password) {
      return 'Basic ' + this.getAuthHash(username, password);
    },

    setCookie: function(obj) {
      $.cookie('auth', this.getAuthHash(obj['username'], obj['password']));
    }
  };

  return extras;
});