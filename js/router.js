define([
  'jquery', 
  'underscore', 
  'backbone', 
  'cookie',
  'models/session',
  'filter',
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
      Filter,
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

    before: {
      'dashboard(/)' : 'verifyLoggedIn',
      '(/)'          : 'rerouteIfLoggedIn',
      'login(/)'     : 'rerouteIfLoggedIn'
    },

    defaultAction: function(action) {
      // FIX: In production this should render some sort of a 'missing
      //      resource' view since opera singers have an inexplicable
      //      tendency not to check their JavaScript consoles when a
      //      page doesn't load.
      console.log('No route for ', action);
    },

    displayDashboard: function() {
      var dashboardView = new DashboardView(this);
      dashboardView.render($.cookie('user'));
    },

    displayHomepage: function() {
      var homepageView = new HomepageView(this);
      homepageView.render();
    },

    displayLogin: function() {
      var loginView = new LoginView(this);
      loginView.render();
    },

    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('user');
      $.removeCookie('userID');
      Backbone.history.navigate('login', {trigger: true});
    },

    rerouteIfLoggedIn: function(fragment, args, next) {
      if (!$.cookie('auth')) {
        next();
      } else {
        Backbone.history.navigate('dashboard', {trigger: true});
      }
    },

    verifyLoggedIn: function(fragment, args, next) {
      if ($.cookie('auth')) {
        next();
      } else {
        Backbone.history.navigate('login', {trigger: true});
      }
    }
  });

  return CantoRouter;
});