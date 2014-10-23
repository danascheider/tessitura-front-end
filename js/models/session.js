define([
  'jquery',
  'underscore',
  'backbone',
  'storage',
  'cookie',
  'extras'
  ], function($, _, Backbone, LocalStorage, Cookie, Extras) {
  
  var SessionModel = Backbone.Model.extend({
    initialize: function() {
      this.load();
    },

    defaults: {
      username : null, 
      password : null,
      userID   : null
    },

    authenticated: function() {
      Boolean(this.get('user'));
    },

    validate: function(attrs) {
      if(!attrs.user || !attrs.auth) {
        return 'user and auth required';
      }
    },

    save: function(auth_hash) {
      $.cookie('auth', Extras.getAuthHash(auth_hash.username, auth_hash.password));
      $.cookie('user', auth_hash.user);
    },

    load: function() {
      this.set({
        auth : $.cookie('auth'),
        user : $.cookie('user')
      });
    },

    localStorage: new Backbone.LocalStorage('sessions-canto')
  });

  return SessionModel;
});