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

    fetchUser: function() {
      var uid = $.cookie('userID');

      return $.ajax({
        url: 'http://localhost:9292/users/' + uid,
        type: 'GET',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          return data;
        },
        error: function(xhr, status, error) {
          console.log('Error: ', error);
        }
      });
    },

    makeBasicAuth: function(username, password) {
      return 'Basic ' + this.getAuthHash(username, password);
    },

    setCookie: function(username, password, user) {
      $.cookie.json = true;
      $.cookie('auth', this.getAuthHash(username, password));
      $.cookie('user', user);
      $.cookie('userID', user['id']);
    }
  };

  return extras;
});