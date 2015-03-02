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

      this.$mainView = new MainView();
      this.$mainView.$homeView = new HomeView();
      this.$mainView.$kanbanView = new KanbanView();

      // If a user is passed to the constructor, set `this.user` and 
      // listen to the user's `sync` event

      if(!!opts.user) { this.setUser(opts.user); }

      // Set up listeners for view events
      this.listenTo(this.$mainView, 'all', this.redirect);
    },

    redirect       : function(e) {
      if(typeof e == 'string' && !!e.match(/redirect\:/)) { 
        this.trigger(e); 
      }
    },

    refreshCurrent : function() {
      if(!this.current) { return; }
      return this.current === 'home' ? this.getHome() : this.getKanban();
    },

    getHome : function() {
      if(!!this.$mainView.$kanbanView) { this.$mainView.$kanbanView.remove(); }

      this.current = 'home';

      this.$mainView.$homeView = this.$mainView.$homeView || new HomeView({user: this.user});
      this.$mainView.$homeView.render();

      this.$mainView.$('nav').after(this.$mainView.$homeView.el);
    },

    getKanban : function() {
      this.$mainView.$homeView.remove();
      this.current = 'kanban';

      this.$mainView.$kanbanView.render();
      this.$mainView.$('nav').after(this.$mainView.$kanbanView.el);
    },

    getMain   : function() {
      this.$mainView.render();
      $('body').html(this.$mainView.el);
    },

    refresh   : function() {
      this.getMain();
      this.refreshCurrent();
      return this;
    },

    removeAll : function() {
      if(!!this.$mainView) { 
        if(!!this.$mainView.$homeView) { this.$mainView.$homeView.remove(); }
        if(!!this.$mainView.$kanbanView) { this.$mainView.$kanbanView.remove(); }
        this.$mainView.remove(); 
      }
    },

    // Set `this.user` and listen to the user's `sync` event

    setUser   : function(user) {
      this.user = user;

      this.$mainView.setUser(user);
      this.$mainView.$homeView.setUser(user);
      this.$mainView.$kanbanView.setUser(user);

      this.listenTo(this.user, 'sync', this.refresh);
    } 
  });

  return DashboardPresenter;
});