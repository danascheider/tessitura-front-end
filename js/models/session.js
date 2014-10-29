define([
  'jquery',
  'underscore',
  'backbone',
  'cookie'
  ], function($, _, Backbone, Cookie) {
  
  var SessionModel = Backbone.Model.extend({
    initialize: function() {
      this.load();
    },

    defaults: {
      auth   : null, 
      userID : null
    },

    authenticated: function() {
      return !!this.attributes.auth;
    },

    validate: function(attrs) {
      if(!attrs.user || !attrs.auth) {
        return 'userID and auth required';
      }
    },

    save: function(auth) {
      var hash = btoa(auth.username + ':' + auth.password);
      $.cookie('auth', hash);
      $.cookie('userID', auth.userID);
    },

    load: function() {
      this.set({
        auth   : $.cookie('auth'),
        userID : $.cookie('userID')
      });
    }
  });

  return SessionModel;
});