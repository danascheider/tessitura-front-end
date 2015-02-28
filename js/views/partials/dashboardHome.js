define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'views/partials/dashboardTopWidgets',
  'views/partials/taskPanel',
  'text!templates/partials/dashboard-home.html'
], function($, _, Backbone, API, DashboardTopWidgetView, TaskPanelView, Template) {

  var DashboardHomeView = Backbone.View.extend({
    template   : _.template(Template),
    id         : 'page-wrapper',
    className  : 'dashboard-home',

    renderTopWidgets : function(data) {
      this.$('#dash-heading').html(this.$topWidgets.render().el);
      this.$topWidgets.delegateEvents();

      return this;
    },

    renderTaskPanel  : function() {
      this.$taskPanel.render();
      this.$('div.col-lg-6').append(this.$taskPanel.el);
      return this;
    },

    remove           : function() {
      this.$taskPanel.remove();
      this.$topWidgets.remove();
      Backbone.View.prototype.remove.call(this);
    },

    // Core view functions //

    initialize : function(opts) {
      opts = opts || {};
      this.user = opts.user;
      this.collection = opts.collection || this.user.tasks;
      this.$taskPanel = new TaskPanelView({collection: this.user.tasks});

      var that = this;
      var data = {
        taskCollection      : that.user.tasks,
        appointmentCount    : 4,
        deadlineCount       : 9,
        recommendationCount : 13
      };
      
      this.$topWidgets = new DashboardTopWidgetView({data: data});
    },

    render     : function() {
      this.$el.html(this.template());
      this.renderTopWidgets();
      this.renderTaskPanel();
      return this;
    }
  });

  return DashboardHomeView;
});