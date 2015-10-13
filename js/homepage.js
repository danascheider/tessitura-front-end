$ = jQuery = require('jquery');
require('jquery.cookie');

var api = require('./api.js');

// Get the contents of a form when it is submitted
function getFormContents(form) {
  var data = $(form).serializeArray(), attributes = {};

  for(var key in data) {
    if(data.hasOwnProperty(key)) {
      var innerKey = data[key].name
      attributes[innerKey] = data[key].value
    }
  }

  return attributes;
}

$(document).ready(function() {
  
  /* Plain Vanilla Listeners */

  $('a[href=#login]').click(function(e) {
    e.preventDefault();
    $('#shade').show();
  });

  $('#shade').dblclick(function(e) {
    if(e.target.id !== 'login-form' && !$('#login-form').has(e.target).length) {
      $(this).hide();
    }
  });

  $('.login-help-link').click(function() {
    console.log('We need some help up in here');
  });

  $('#login-form').submit(function(e) {
    e.preventDefault();

    var attributes             = getFormContents(this),
        auth                   = btoa(attributes['username'] + ':' + attributes['password']),
        userShouldBeRemembered = attributes.remember;

    $.ajax({
      method: 'POST',
      url: api.login,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + auth);
      },
      success: function(data, success, xhr) {
        data = JSON.parse(data);
        userShouldBeRemembered ? $.cookie('auth', auth, {expires: 365}) : $.cookie('auth', auth);
        userShouldBeRemembered ? $.cookie('userID', data.id, {expires: 365}) : $.cookie('userID', data.id);
        location.href = 'https://tessitura.io/dashboard';
      },
      error  : function(model, response) {
        console.log('Login unsuccessful: ', response);
      }
    });
  });
});