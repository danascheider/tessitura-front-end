define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'models/task',
  'collections/tasks',
  'views/main/dashboard',
  'views/partials/dashboardHome',
  'views/partials/kanbanBoard',
  'cookie'

], function(
  $, _, 
  Backbone, 
  UserModel, 
  TaskModel, 
  TaskCollection, 
  MainView, 
  HomeView, 
  KanbanView
) {

  var DashboardPresenter = Backbone.Model.extend({
    initialize     : function(opts) {
      opts = opts || {};

      this.$dashboard = new MainView();

      // If a user is passed to the constructor, set `this.user` and 
      // listen to the user's `sync` event

      if(!!opts.user) { this.setUser(opts.user); }

      // Set up listeners for view events
      this.listenTo(this.$dashboard, 'redirect', this.redirect);
    },

    redirect       : function(e) {
      this.trigger('redirect', {destination: e.destination});
    },

    refreshCurrent : function() {
      if(!this.current) { return; }
      return this.current === 'home' ? this.getHome() : this.getTask();
    },

    getHome : function() {
      this.current = 'home';

      var that = this;
      this.$dashboard.showHomeView();

      if(!this.$dashboard.$el.is(':visible')) {
        $('body').html(that.$dashboard.el);
      };
    },

    getTask : function() {
      this.current = 'task';

      var that = this;
      this.$dashboard.showTaskView();
      if(!this.$dashboard.$el.is(':visible')) {
        $('body').html(that.$dashboard.el);
      };
    },

    refresh   : function() {
      this.refreshCurrent();
      return this;
    },

    removeAll : function() {
      this.$dashboard.remove();
    },

    // Set `this.user` and listen to the user's `sync` event

    setUser   : function(user) {
      var that = this;
      this.user = user;

      this.user.protectedFetch({async: false});
      this.user.tasks = new TaskCollection();
      this.user.tasks.fetch();
      
      this.$dashboard.setUser(user);

      this.listenTo(this.user, 'sync', this.refresh);
    } 
  });

  return DashboardPresenter;
});