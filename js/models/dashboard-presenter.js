define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'models/user',
  'models/task',
  'collections/tasks',
  'views/app/dashboard',
  'views/app/dashboard-home',
  'views/app/kanban-board',
  'cookie'
], function($, _, Backbone, API, UserModel, TaskModel, TaskCollection, MainView, HomeView, KanbanView) {
  var DashboardPresenter = Backbone.Model.extend({
    initialize: function() {
      this.user = new UserModel({id: $.cookie('id')});
      this.getMain();
    },

    getHome : function() {
      if(!!this.mainView.$kanbanView) { this.mainView.$kanbanView.remove(); }
      this.mainView.$homeView = this.mainView.$homeView || new HomeView({user: this.user});
      this.mainView.$homeView.render();
      this.mainView.$('nav').after(this.mainView.$homeView.el);
    },

    getKanban : function() {
      if(!!this.mainView.$homeView) { this.mainView.$homeView.remove(); }
      this.mainView.$kanbanView = this.mainView.$kanbanView || new KanbanView({user: this.user});
      this.mainView.$kanbanView.render();
      this.mainView.$('nav').after(this.mainView.$kanbanView.el);
    },

    getMain : function() {
      this.mainView = this.mainView || new MainView({user: this.user});
      this.mainView.render();
      return this.mainView.el;
    },

    removeAll : function() {
      if(!!this.mainView.$homeView) { this.mainView.$homeView.remove(); }
      if(!!this.mainView.$kanbanView) { this.mainView.$kanbanView.remove(); }
      if(!!this.mainView) { this.mainView.remove(); }
    }
  });

  return DashboardPresenter;
});