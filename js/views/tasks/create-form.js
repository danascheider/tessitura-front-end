define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, taskCreateForm) {

  var TaskCreateFormView = Backbone.View.extend({
    el    : $('#task-form'),
    render: function() {
      var compiledTemplate = _.template(taskCreateForm);
      this.$el.html(compiledTemplate);
      return this;
    }
  });

  return TaskCreateFormView
});