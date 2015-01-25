define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'models/task',
  'collections/tasks',
  'views/app/dashboard',
  'views/app/dashboard-home',
  'views/app/kanban-board',
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
    initialize : function(opts) {
      opts = opts || {};
      this.user = opts.user;
      this.mainView = new MainView({user: this.user});

      this.listenTo(this.user, 'sync', this.refresh);
    },

    refreshCurrent : function() {
      if(!this.current) { return; }
      return this.current === 'home' ? this.getHome() : this.getKanban();
    },

    getHome : function() {
      if(!!this.mainView.$kanbanView) { this.mainView.$kanbanView.remove(); }

      this.current = 'home';

      this.mainView.$homeView = this.mainView.$homeView || new HomeView({user: this.user});
      this.mainView.$homeView.render();

      this.mainView.$('nav').after(this.mainView.$homeView.el);
    },

    getKanban : function() {
      if(!!this.mainView.$homeView) { this.mainView.$homeView.remove(); }

      this.current = 'kanban';

      this.mainView.$kanbanView = this.mainView.$kanbanView || new KanbanView({user: this.user});
      this.mainView.$kanbanView.render();

      this.mainView.$('nav').after(this.mainView.$kanbanView.el);
    },

    getMain   : function(element) {
      this.mainView = this.mainView || new MainView({user: this.user});
      this.mainView.render();
      $(element).html(this.mainView.el);
    },

    refresh   : function() {
      this.getMain();
      this.refreshCurrent();
      return this;
    },

    removeAll : function() {
      if(!!this.mainView) { this.mainView.remove(); }
    }
  });

  return DashboardPresenter;
});