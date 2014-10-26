define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    template: _.template(TaskModelTemplate),

    render: function() {
      console.log('Rendering task model');
      this.$el.html(this.template(this.model));
      return this;
    }
  });

  return TaskModelView;
});