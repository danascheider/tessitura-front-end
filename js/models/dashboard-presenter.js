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
      this.user = opts.user;
      this.mainView = new MainView({user: this.user});
    },

    getHome : function() {
      console.log('Getting the home view');
      if(!!this.mainView.$kanbanView) { this.mainView.$kanbanView.remove(); }

      this.mainView.$homeView = this.mainView.$homeView || new HomeView({user: this.user});
      this.mainView.$homeView.render();

      this.mainView.$('nav').after(this.mainView.$homeView.el);
    },

    getKanban : function() {
      console.log('Getting the kanban view');
      if(!!this.mainView.$homeView) { this.mainView.$homeView.remove(); }

      this.mainView.$kanbanView = this.mainView.$kanbanView || new KanbanView({user: this.user});
      this.mainView.$kanbanView.render();

      this.mainView.$('nav').after(this.mainView.$kanbanView.el);
    },

    getMain   : function(element) {
      console.log('Rendering the main view');
      this.mainView = this.mainView || new MainView({user: this.user});
      this.mainView.render();
      $(element).html(this.mainView.el);
    },

    removeAll : function() {
      if(!!this.mainView) { this.mainView.remove(); }
    }
  });

  return DashboardPresenter;
});