define([
  'jquery', 
  'underscore', 
  'backbone', 
  'cookie',
  'models/session',
  'filter',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage',
  'views/app/kanban-board'
], function($, 
    _, Backbone, 
    Cookie,
    Session,
    Filter,
    LoginView, 
    DashboardView,
    HomepageView,
    KanbanBoardView) {
  
  var CantoRouter = Backbone.Router.extend({
    routes: {
      '(/)'            : 'displayHomepage',
      'home(/)'        : 'displayHomepage',
      'login(/)'       : 'displayLogin',
      'dashboard(/)'   : 'displayDashboard',
      'tasks(/)'       : 'displayKanban',
      'logout(/)'      : 'logOut',
      '*actions'       : 'defaultAction'
    },

    before: {
      'dashboard(/)' : 'verifyLoggedIn',
      'tasks(/)'     : 'verifyLoggedIn',
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
      // FIX: This should really not render the whole dashboard every
      //      single time.
      var dashboardView = new DashboardView();
      dashboardView.render();
    },

    displayKanban: function() {
      var kanbanBoardView = new KanbanBoardView({el: $('#page-wrapper')});
      kanbanBoardView.render();
    },

    displayHomepage: function() {
      var homepageView = new HomepageView(this);
      homepageView.render();
    },

    displayLogin: function() {
      var loginView = new LoginView();
      loginView.render();
    },

    logOut: function() {
      $.removeCookie('auth');
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