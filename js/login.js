var app = app || {};
var currentSession = {}

var makeBasicAuth = function(username, password) {
  var tok = username + ':' + password
  var hash=btoa(tok);
  return 'Basic ' + hash
}
  
var loginUser = function(data) {
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

// User login
$('.login-form button:submit').click(function(e) {
  e.preventDefault();
  var form = $(this).parent('form');
  var data = getAttributes(form)
  loginUser(data);
});