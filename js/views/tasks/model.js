define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, taskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    render: function() {
      var data = {};
      var compiledTemplate = _.template(taskModelTemplate, data);
      this.$el.html(compiledTemplate);
      return this;
    }
  });

  return TaskModelView;
});