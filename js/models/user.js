define([
  'jquery', 'underscore', 'backbone', 'relational', 'storage'
  ], function($, _, Backbone, Relational, DualStorage) {
  var User = Backbone.RelationalModel.extend({
    urlRoot: 'http://localhost:9292/users',
    relations: [{
      type:           'HasMany',
      relatedModel:   'TaskList',
      reverseRelation: {
        key: 'userId'
      }
    }],
    
    initialize: function() {
      defaults: {
        admin: false
      }
    },

    name: function() {
      return this.firstName + ' ' + this.lastName;
    }
  });
  return User;
});