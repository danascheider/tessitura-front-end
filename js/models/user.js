define([
  'jquery', 'underscore', 'backbone', 'storage'
  ], function($, _, Backbone, DualStorage) {
  var User = Backbone.Model.extend({
    urlRoot: 'http://localhost:9292/users',
    
    initialize: function() {
      defaults: {
        admin: false
      }
    },

    name: function() {
      return this.firstName + ' ' + this.lastName;
    },

    storeName: 'users' 
  });
  
  return User;
});