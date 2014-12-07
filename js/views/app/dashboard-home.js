define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/app/dashboard-top-widgets',
  'views/tasks/task-panel',
  'text!templates/partials/dashboard-home.html'
], function($, _, Backbone, UserModel, DashboardTopWidgetView, TaskPanelView, Template) {

  var DashboardHomeView = Backbone.View.extend({
    template   : _.template(Template),

    // Core view functions
    initialize : function(opts) {
      this.user = opts.user;
      this.render();
    },

    render     : function() {
      var html = this.template();
      this.$el.html(html);

      // Fetch the user's tasks and render in the task panel
      var that = this;
      var data = {
        appointmentCount    : 4,
        deadlineCount       : 9,
        recommendationCount : 13
      };

      this.user.fetchIncompleteTasks().then(function(collection) {
          data.taskCollection = collection;
          
          that.$topWidgets = new DashboardTopWidgetView({ 
                                el: that.$('#dash-heading'), 
                                data: data
                              });

          that.$taskPanel = new TaskPanelView({el: that.$('#task-panel'), collection: collection});
      }, function(error) {
        console.log('Error: ', error);
      });

      return this;
    }
  });

  return DashboardHomeView;
});