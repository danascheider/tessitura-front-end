define([
  'jquery', 
  'underscore', 
  'backbone', 
  'cookie',
  'models/session',
  'callbacks',
  'views/tasks/collection',
  'views/task-lists/collection',
  'views/users/collection',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage'
  ], function($, 
      _, Backbone, 
      Cookie,
      Session,
      Callbacks,
      TaskCollectionView, 
      TaskListCollectionView, 
      UserCollectionView, 
      LoginView, 
      DashboardView,
      HomepageView) {
  
  var CantoRouter = Backbone.Router.extend({
    routes: {
      '(/)'            : 'displayHomepage',
      'home(/)'        : 'displayHomepage',
      'login(/)'       : 'displayLogin',
      'dashboard(/)'   : 'displayDashboard',
      'logout(/)'      : 'logOut',
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
      if (window.Session && window.Session.get('user')) {
        var dashboardView = new DashboardView(this);
        dashboardView.render(window.Session.get('user'));
      } else {
        Backbone.history.navigate('login', {trigger: true});
      }
    },

    displayHomepage: function() {
      var homepageView = new HomepageView(this);
      homepageView.render();
    },

    displayLogin: function() {
      if (window.Session && window.Session.authenticated()) {
        Backbone.history.navigate('dashboard', {trigger: true});
      } else {
        var loginView = new LoginView(this);
        loginView.render();
      }
    },

    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('user');
      $.removeCookie('userID');
      Backbone.history.navigate('login', {trigger: true});
    }
  });

  return CantoRouter;
});