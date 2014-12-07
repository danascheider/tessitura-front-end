define(['jquery', 'cookie'], function() {

  var Utils = {

    // Functions //

    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(var key in formData) {
        var chiave = formData[key].name;
        if(formData[key].value !== '') {
          attributes[chiave] = formData[key].value;
        }
      }

      return attributes;
    },

    authHeader: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
    },

    requireLogin: function() {
      if (!($.cookie('auth'))) {
        Backbone.history.navigate('login');
      }
    }
  };

  return Utils;
});