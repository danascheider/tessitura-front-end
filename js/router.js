define([
  'jquery', 
  'underscore', 
  'backbone', 
  'views/tasks/collection',
  'views/task-lists/collection',
  'views/users/collection',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage'
  ], function($, 
      _, Backbone, 
      TaskCollectionView, 
      TaskListCollectionView, 
      UserCollectionView, 
      LoginView, 
      DashboardView,
      HomepageView) {
  
  var CantoRouter = Backbone.Router.extend({
    routes: {
      ''            : 'displayHomepage',
      '/'           : 'displayHomepage',
      '/login'      : 'displayLogin',
      '/dashboard'  : 'displayDashboard',
      '/users'      : 'listUsers',
      '/tasks'      : 'listTasks',
      '/task-lists' : 'listTaskLists',
      '*actions'    : 'defaultAction'
    },

    displayLogin: function() {
      var loginView = new LoginView;
      $('body').attr('id', 'dashboard');
      loginView.render();
    },

    displayHomepage: function() {
      var homepageView = new HomepageView(this);
      $('body').attr('id', 'homepage');
      homepageView.render();
    },

    displayDashboard: function() {
      var dashboardView = new DashboardView;
      dashboardView.render();
    },

    listUsers: function() {
      var userCollectionView = new UserCollectionView;
      userCollectionView.render();
    },

    listTasks: function() {
      var taskCollectionView = new TaskCollectionView;
      taskCollectionView.router();
    },

    listTaskLists: function() {
      var taskListCollectionView = new TaskListCollectionView;
      taskListCollectionView.render();
    }
  });

  return CantoRouter;
});