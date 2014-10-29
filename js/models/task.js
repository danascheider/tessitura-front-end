define([
  'jquery',
  'underscore',
  'backbone',
  'storage',
  'api'
  ], function($, _, Backbone, DualStorage, API) {
  
  var TaskModel = Backbone.Model.extend({
    urlRoot: API.tasks.root,

    complete: function() {
      return Boolean(this.get('status') === 'Complete');
    },

    incomplete: function() {
      return Boolean(this.get('status') !== 'Complete');
    },

    initialize: function() {
      this.on('invalid', function(model, error) {
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