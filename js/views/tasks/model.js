define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    template: _.template(TaskModelTemplate),
    tagName : 'td',

    render: function() {
      this.$el.html(this.template({model: this.model}));
      return this;
    }
  });

  return TaskModelView;
});