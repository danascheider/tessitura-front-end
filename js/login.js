var makeBasicAuth = function(username, password) {
  var tok = username + ':' + password
  var hash=btoa(tok);
  return 'Basic ' + hash
}
  
var loginUser = function(data) {
  $.ajax({
    url: 'http://localhost:9292/login',
    type: 'POST',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', makeBasicAuth(data['username'], data['password']));
    },
    success: function(data, status, xhr) {
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