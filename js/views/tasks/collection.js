define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/list-entry',
  'text!templates/tasks/collection.html'
  ], function($, _, Backbone, ListEntryView, TaskCollectionTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    template : _.template("<table class='task-list'></table>"),

    // Core View Functions //

    initialize: function(tasks) {
      this.tasks = tasks.tasks;
    },

    render: function() {
      this.$el.append(this.template());
      var that = this;
      var html = ''

      _.each(this.tasks, function(task) {
        console.log(task.title);
        var listEntryView = new ListEntryView({task: task, el: that.$el.find('table.task-list')});
        that.$el.append(listEntryView.render().el);
      });

      return this;
    }
  });

  return TaskCollectionView;
});