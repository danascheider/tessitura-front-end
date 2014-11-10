define([
  'underscore',
  'backbone',
  'api',
  ], function(_, Backbone, API) {
  
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

    prettyDeadline: function() {
      // Without being prettified, deadlines show up in the view like this:
      // 2014-11-10 00:00:00 -0800. They should instead say 11/10/2014.
      return this.get('deadline');
    },

    validate  : function(attrs) {
      if (!attrs.title) {
        return 'Title is required';
      }
    }
  });

  return TaskModel
});