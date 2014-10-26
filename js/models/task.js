define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'storage'
  ], function($, _, Backbone, Cookie, DualStorage) {
  
  var TaskModel = Backbone.Model.extend({
    urlRoot   : 'http://localhost:9292/users/' + $.cookie('userID') + '/tasks',

    initialize: function() {
      this.on('invalid', function(model, error) {
        console.info(model.attributes);
        console.log('**Validation error: ' + error + '**');
      });
    },

    validate  : function(attrs) {
      if (!attrs.title) {
        return 'Title is required';
      }
    },

    storeName : 'tasks',
  });

  return TaskModel
});