define(['jquery', 'models/session'], function($, Session) {
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
    }
  };

  return extras;
});