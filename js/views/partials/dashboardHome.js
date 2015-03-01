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

    createTopWidgets : function() {
      var that = this;
      var data = {
        taskCollection      : that.collection,
        appointmentCount    : 4,
        deadlineCount       : 9,
        recommendationCount : 13
      };
      
      this.$topWidgets = new DashboardTopWidgetView({data: data});
    },

    renderTopWidgets : function(data) {
      this.$topWidgets.render();
      this.$('#dash-heading').html(this.$topWidgets.el);
      this.$topWidgets.delegateEvents();

      return this;
    },

    renderTaskPanel  : function() {
      this.$taskPanel.render();
      this.$('div.col-lg-6').append(this.$taskPanel.el);
      return this;
    },

    remove           : function() {
      if(!!this.$taskPanel) { this.$taskPanel.remove(); }
      if(!!this.$topWidgets) { this.$topWidgets.remove(); }
      Backbone.View.prototype.remove.call(this);
    },

    setUser          : function(user) {
      this.user = user;
      this.collection = this.collection || this.user.tasks;

      this.$taskPanel = new TaskPanelView({collection: this.collection});
      this.createTopWidgets();
    },

    // ------------------- //
    // Core view functions //
    // ------------------- //

    initialize : function(opts) {
      opts = opts || {};
      this.collection = opts.collection;
      if(!!opts.user) { this.setUser(opts.user); }
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