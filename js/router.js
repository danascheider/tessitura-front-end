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
      '(/)'            : 'displayHomepage',
      'login(/)'       : 'displayLogin',
      'dashboard(/)'   : 'displayDashboard',
      '*actions'       : 'defaultAction'
    },

    defaultAction: function(action) {
      // FIX: In production this should render some sort of a 'missing
      //      resource' view since opera singers have an inexplicable
      //      tendency not to check their JavaScript consoles when a
      //      page doesn't load.
      console.log('No route for ', action);
    },

    displayDashboard: function() {
      console.log('Function called: displayDashboard');
      var dashboardView = new DashboardView(this);
      $('body').attr('id', 'dashboard');
      dashboardView.render();
    },

    displayHomepage: function() {
      console.log('Function called: displayHomepage');
      var homepageView = new HomepageView(this);
      $('body').attr('id', 'homepage');
      homepageView.render();
    },

    displayLogin: function() {
      console.log('Function called: displayLogin');
      var loginView = new LoginView(this);
      $('body').attr('id', 'dashboard');
      loginView.render();
    }
  });

  return CantoRouter;
});