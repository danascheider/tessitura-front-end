define(['jquery', 'cookie', 'backbone'], function() {

  var Utils = {

    // Functions //

    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(key in formData) {
        if (formData.hasOwnProperty(key)) {
          var chiave = formData[key].name;
          if(formData[key].value !== '') {
            attributes[chiave] = formData[key].value;
          }
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