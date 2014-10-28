define([
  'jquery',
  'underscore',
  'backbone',
  'storage',
  'api'
  ], function($, _, Backbone, DualStorage, API) {
  
  var TaskModel = Backbone.Model.extend({
    urlRoot: API.tasks.root,

    incomplete: function() {
      return Boolean(this.status !== 'Complete');
    },

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