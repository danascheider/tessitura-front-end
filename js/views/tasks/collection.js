define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/task/list.html'
  ], function($, _, Backbone, taskListTemplate) {
  
  var TaskListView = Backbone.View.extend({
    el    : $('#container'),
    render: function() {
      var data = {};
      var compiledTemplate = _.template(taskListTemplate, data);
      this.$el.append(compiledTemplate);
    }
  });

  return TaskListView;
});