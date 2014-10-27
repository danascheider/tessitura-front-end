define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    template: _.template(TaskModelTemplate),

    initialize: function() {
      this.model = this.model.task;
    },

    render: function() {
      return (this.template(this.model));
      return this;
    }
  });

  return TaskModelView;
});