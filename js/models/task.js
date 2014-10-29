define([
  'jquery',
  'underscore',
  'backbone',
  'api'
  ], function($, _, Backbone, API) {
  
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
    }
  });

  return TaskModel
});