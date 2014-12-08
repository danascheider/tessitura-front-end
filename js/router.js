define([
  'jquery', 
  'underscore', 
  'backbone', 
  'cookie',
  'filter',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage',
], function($, 
    _, Backbone, 
    Cookie,
    Filter,
    LoginView, 
    DashboardView,
    HomepageView,
    DashboardHomeView
) {
  
  var CantoRouter = Backbone.Router.extend({
    dashboardView: new DashboardView(),
    homepageView : new HomepageView(this),

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
      this.dashboardView.$kanbanBoardView.remove();
      this.dashboardView.$homeView.render();
      this.dashboardView.$('nav').after(this.dashboardView.$homeView.el);
    },

    displayKanban: function() {
      this.dashboardView.$homeView.remove();
      this.dashboardView.$kanbanBoardView.render();
      this.dashboardView.$('nav').after(this.dashboardView.$kanbanBoardView.el);
    },

    displayHomepage: function() {
      this.homepageView.render();
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

    renderMainDash: function() {
      this.dashboardView.render();
    },

    rerouteIfLoggedIn: function(fragment, args, next) {
      if (!$.cookie('auth')) {
        this.renderMainDash();
        next();
      } else {
        Backbone.history.navigate('dashboard', {trigger: true});
      }
    },

    verifyLoggedIn: function(fragment, args, next) {
      if ($.cookie('auth')) {
        this.renderMainDash();
        next();
      } else {
        Backbone.history.navigate('login', {trigger: true});
      }
    }
  });

  return CantoRouter;
});