define([
  'underscore',
  'backbone',
  'storage',
  'cookie'
  ], function(_, Backbone, LocalStorage, Cookie) {
  
  var SessionModel = Backbone.Model.extend({
    initialize: function() {
      this.load();
    },

    defaults: {
      username     : null, 
      password     : null,
      adminSession : false
    },

    authenticated: function() {
      Boolean(this.get('userID'));
    },

    validate: function(attrs) {
      if(!attrs.userID || !attrs.password) {
        return 'userID and password required';
      }
    },

    save: function(auth_hash) {
      $.cookie('username', auth_hash.username);
      $.cookie('password', auth_hash.password);
    },

    load: function() {
      this.set({
        username: $.cookie('username'),
        password: $.cookie('password')
      });
    },

    localStorage: new Backbone.LocalStorage('sessions-canto')
  });

  return SessionModel;
});