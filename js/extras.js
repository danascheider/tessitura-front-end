define([
  'jquery', 
  'cookie', 
  'models/session', 
  'models/user'
  ], function($, Cookie, Session, UserModel) {

  var extras = {

    // Basic info for Ajax requests //

    basePath : 'http://localhost:9292',

    // Functions //

    fetchUser: function() {
      var currentUser;
      var uid = $.cookie('userID');

      return $.ajax({ // Why does this need `return`? I have no fucking idea.
        url: this.basePath + '/users/' + uid,
        type: 'GET',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          currentUser = new UserModel(data);
          currentUser.save(currentUser.attributes, {remote: false});
          return currentUser;
        },
        error: function(xhr, status, error) {
          console.log('Error: ', error);
        }
      });
    },

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

    setCookie: function(username, password, uid) {
      $.cookie('auth', this.getAuthHash(username, password));
      $.cookie('userID', uid);
    }
  };

  return extras;
});