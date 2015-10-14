$ = jQuery = require('jquery');
require('jquery.cookie');

var api = require('./api.js');
var base = 'https://tessitura.io';

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

require('./registration-form.js');

$(document).ready(function() {

  // Reroute the user to the dashboard if they are already logged in
  if($.cookie('userID') && $.cookie('auth') && !location.href.match(/\/home$/)) {
    location.href = base + '/dashboard';
  }

  /* Plain Vanilla Listeners */

  // When the user clicks the login link, the #shade element appears. The #shade div
  // wraps the login form, creating a transparent black layer over the rest of the
  // site that highlights the form.
  $('a[href=#login]').click(function(e) {
    e.preventDefault();
    $('#shade').show();
  });

  // If the login form is visible, the user should be able to hide it by double-
  // clicking any part of the #shade element other than the form itself. 
  $('#shade').dblclick(function(e) {
    if(e.target.id !== 'login-form' && !$('#login-form').has(e.target).length) {
      $(this).hide();
    }
  });

  // FIX: Login help link is not fully implemented
  $('.login-help-link').click(function() {
    console.log('We need some help up in here');
  });

  // Log the user in when they submit the login form

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
        location.href = base + '/dashboard';
      },
      error  : function(model, response) {
        console.log('Login unsuccessful: ', response);
      }
    });
  });
});