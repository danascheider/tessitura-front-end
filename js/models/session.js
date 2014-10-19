var app = app || {};

define([
  'underscore',
  'backbone',
  'storage'
  ], function(_, Backbone, LocalStorage) {
  
  var SessionModel = Backbone.Model.extend({
    initialize: function() {
      console.log('Session created');
    },

    defaults: {
      adminSession: false,
      remember:     false
    },

    validate: function(attrs) {
      if(!attrs.userID) {
        return 'userID required';
      }
    },

    localStorage: new Backbone.LocalStorage('sessions-canto')
  });
});

app.Session = Backbone.Model.extend({
  initialize: function() {
    console.log('Session created');
  },
  
  defaults: {
    adminSession: false,
    remember: false
  },

  validate: function(attrs) {
    if(!attrs.userID) {
      return 'userID required'
    }
  },

  localStorage: new Backbone.LocalStorage('sessions-canto')
});