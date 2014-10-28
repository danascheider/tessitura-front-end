define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/list-entry',
  'text!templates/tasks/collection.html'
  ], function($, _, Backbone, ListEntryView, TaskCollectionTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    template : _.template(TaskCollectionTemplate),

    // Core View Functions //
    initialize: function() {
      _.bindAll(this, 'renderModel');
      this.render();
    },

    renderModel: function(task) {
      var listEntryView = new ListEntryView({model: task});
      $(this.el).append(listEntryView.el);
    },

    render: function() {
      var that = this;
      this.collection.each(this.renderModel);

      return this;
    }
  });

  return TaskCollectionView;
});