define([
  'jquery', 
  'underscore', 
  'backbone', 
  'storage', 
  'api'
  ], function($, _, Backbone, DualStorage, API) {

  var User = Backbone.Model.extend({
    urlRoot: API.users.collection,
    
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