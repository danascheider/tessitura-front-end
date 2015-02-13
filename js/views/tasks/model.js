define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  // FIX: This should probably listen to its model, dontcha think?

  var TaskModelView = Backbone.View.extend({
    className : 'task-model',
    template  : _.template(TaskModelTemplate),

    render    : function() {
      this.$el.html(this.template({model: this.model}));
      return this;
    }
  });

  return TaskModelView;
});