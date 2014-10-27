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
    initialize: function() {
      this.render();
    },

    render: function() {
      var that = this;

      this.collection.each(function(task) {
        var listEntryView = new ListEntryView({el: that.$el, model: task});
      });

      return this;
    }
  });

  return TaskCollectionView;
});