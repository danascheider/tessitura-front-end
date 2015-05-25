requirejs.config({
  paths: {
    jquery     : './lib/jquery-2.1.1',
    underscore : './lib/underscore',
    backbone   : './lib/backbone',
    basic      : './lib/backbone.basicauth'
  }
});

require([
  'jquery', 
  'underscore', 
  'backbone',
  'basic', 
  'extras'
  ], function($, _, Backbone, Basic, Extras) {
  //
});

var app = app || {};
var currentSession = {}

// User login
$('.login-form button:submit').click(function(e) {
  e.preventDefault();
  var form = $(this).parent('form');
  var data = getAttributes(form)
  loginUser(data);
});