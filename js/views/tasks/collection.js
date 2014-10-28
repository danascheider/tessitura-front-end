define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/list-entry',
  'views/tasks/create-form',
  'text!templates/tasks/collection.html',
  ], function($, _, Backbone, ListEntryView, CreateFormView, TaskCollectionTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    template : _.template("<table class='task-list'></table>"),

    // Core View Functions //
    initialize: function() {
      _.bindAll(this, 'renderModel');
      this.render();
    },

    renderModel: function(task) {
      if (task.incomplete()) {
        var listEntryView = new ListEntryView({model: task});
        $(this.el).append(listEntryView.el);
      }
    },

    render: function() {
      this.$createForm = new CreateFormView({el: $(this.el).find('tr.create-task td')});
      this.$createForm.render();
      this.collection.each(this.renderModel);

      return this;
    }
  });

  return TaskCollectionView;
});