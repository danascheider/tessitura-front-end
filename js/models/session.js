define([
  'jquery',
  'underscore',
  'backbone',
  'storage',
  'cookie',
  'extras'
  ], function($, _, Backbone, DualStorage, Cookie, Extras) {
  
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

    save: function(auth_hash) {
      $.cookie('auth', Extras.getAuthHash(auth_hash.username, auth_hash.password));
      $.cookie('userID', auth_hash.userID);
    },

    load: function() {
      this.set({
        auth   : $.cookie('auth'),
        userID : $.cookie('userID')
      });
    },

    local: true // Sessions should only be stored locally
  });

  return SessionModel;
});