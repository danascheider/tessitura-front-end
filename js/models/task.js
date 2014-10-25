define([
  'jquery',
  'underscore',
  'backbone',
  'relational',
  'cookie'
  ], function($, _, Backbone, Relational, cookie) {
  
  var TaskModel = Backbone.RelationalModel.extend({
    urlRoot   : 'http://localhost:9292/users/' + $.cookie('userID') + '/tasks',

    relations : [{
      type        : Backbone.HasOne,
      relatedModel: 'TaskList'
    }],

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
    }
  });

  return TaskModel
});