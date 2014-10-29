define([
  'jquery', 
  'underscore', 
  'backbone', 
  'api'
  ], function($, _, Backbone, API) {

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
  });
  
  return User;
});