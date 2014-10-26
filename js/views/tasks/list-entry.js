define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/model',
  'text!templates/tasks/list-entry.html',
  'text!templates/tasks/model.html'
], function($, _, Backbone, TaskView, ListEntryTemplate, TaskModelTemplate) {

  var ListEntryView = Backbone.View.extend({
    template: _.template(ListEntryTemplate),

    initialize: function(task) {
      this.task = task;
    },

    render: function() {
      this.$el.append(this.template());

      var listing = this.$el.find('td.task-listing');
      var modelView = new TaskView({el: listing, model: this.task});
      listing.append(modelView.render().el);
      return this;
    }
  });

  return ListEntryView;
});