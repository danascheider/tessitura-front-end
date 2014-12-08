define([
  'jquery',
  'underscore',
  'backbone',
  'views/app/dashboard-top-widgets',
  'views/tasks/task-panel',
  'text!templates/partials/dashboard-home.html'
], function($, _, Backbone, DashboardTopWidgetView, TaskPanelView, Template) {

  var DashboardHomeView = Backbone.View.extend({
    template   : _.template(Template),
    id         : 'page-wrapper',

    renderTopWidgets : function(data) {
      this.$topWidgets = new DashboardTopWidgetView({
        el: this.$('#dash-heading'),
        data: data
      });

      return this;
    },

    renderTaskPanel  : function(collection) {
      this.$taskPanel = new TaskPanelView({el: this.$('#task-panel'), collection: collection});
      return this;
    },

    // Core view functions //

    render     : function() {
      this.$el.html(this.template());

      // Fetch the user's tasks and render in the task panel
      var that = this;
      var data = {
        appointmentCount    : 4,
        deadlineCount       : 9,
        recommendationCount : 13
      };

      window.user.fetchIncompleteTasks().then(function(collection) {
        data.taskCollection = collection;
        that.renderTopWidgets(data).renderTaskPanel(collection);
      }, function(error) {
        console.log('Error: ', error);
      });

      return this;
    }
  });

  return DashboardHomeView;
});