define([
  'jquery', 
  'underscore', 
  'backbone', 
  'cookie',
  'filter',
  'models/dashboard-presenter',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage',
], function($, 
    _, Backbone, 
    Cookie,
    Filter,
    DashboardPresenter,
    LoginView, 
    DashboardView,
    HomepageView,
    DashboardHomeView
) {
  
  var CantoRouter = Backbone.Router.extend({
    dashboardPresenter : new DashboardPresenter(),

    renderMainDashView : function() {
      $('body').prepend(this.dashboardPresenter.getMain());
    },

    renderDashHomeView : function() {
      this.dashboardPresenter.getHome();
    },

    renderDashTaskView : function() {
      this.dashboardPresenter.getKanban();
    },

    renderLoginView    : function() {
      this.dashboardPresenter.removeAll();
      this.loginView = this.loginView || new LoginView();
      this.loginView.render();
      $('body').prepend(this.loginView.el);
    },

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
      this.renderDashHomeView();
    },

    displayKanban: function() {
      this.renderDashTaskView();
    },

    displayHomepage: function() {
      this.dashboardPresenter.removeAll();
      this.homepageView = new HomepageView();
      this.homepageView.render();
      $('body').prepend(this.homepageView.el);
    },

    displayLogin: function() {
      this.dashboardPresenter.removeAll();
      this.renderLoginView();
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
        this.renderMainDashView();
        next();
      } else {
        Backbone.history.navigate('login', {trigger: true});
      }
    }
  });

  return CantoRouter;
});