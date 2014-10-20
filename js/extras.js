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
    },

    loginUser: function(data) {
      var username = data['username'];
      var password = data['password'];
      var remember = data['remember'];

      $.ajax({
        url: 'http://localhost:9292/login',
        type: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', makeBasicAuth(username, password));
        },
        success: function(data, status, xhr) {
          currentSession = new Session();
          currentSession.save({
            userID: data['id'],
            username: username,
            password: password,
            remember: remember,
            adminSession: data['admin']
          });
        }
      })
    }
  };

  return extras;
});

var loginUser = function(data) {
  $.ajax({
    url: 'http://localhost:9292/login',
    type: 'POST',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', makeBasicAuth(username, password));
    },
    success: function(data, status, xhr) {
      currentSession = new app.Session();
      currentSession.save({
        userID: data['id'], 
        username: username, 
        password: password,
        remember: remember,
        adminSession: data['admin']
      });

      // FIX: URL hard-coded to filesystem
      window.location = 'file:///home/dscheider/Development/canto-front-end/dashboard.html';
    },

    error: function() {
      console.log('Error');
    }
  });
}