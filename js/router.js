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
    clearExistingViews : function(opts) {
      if (opts && opts.excludeDashboard === true) {
        _.each([this.homepageView, this.loginView], function(view) {
          if(view) { view.remove(); }
        });
      } else {
        _.each([this.homepageView, this.loginView, this.dashboardView], function(view) {
          if(view) { view.remove(); }
        });
      }
    },

    renderMainDashView : function() {
      this.clearExistingViews({excludeDashboard: true});
      this.dashboardView = this.dashboardView || new DashboardView();
      this.dashboardView.render();
      $('body').prepend(this.dashboardView.el);
    },

    renderDashHomeView : function() {
      this.dashboardView.$kanbanBoardView ? this.dashboardView.$kanbanBoardView.remove() : next();
      this.renderMainDashView();
      this.dashboardView.$homeView.render();
      this.dashboardView.$('nav').after(this.dashboardView.$homeView.el);
    },

    renderDashTaskView : function() {
      console.log('renderDashTaskView');
      this.renderMainDashView();
      this.dashboardView.$kanbanBoardView.render();
      this.dashboardView.$('nav').after(this.dashboardView.$kanbanBoardView.el);
    },

    renderLoginView    : function() {
      console.log('renderLoginView');
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
      console.log('displayKanban');
      this.renderDashTaskView();
    },

    displayHomepage: function() {
      this.homepageView = new HomepageView();
      this.homepageView.render();
      $('body').prepend(this.homepageView.el);
    },

    displayLogin: function() {
      console.log('displayLogin');
      this.renderLoginView();
    },

    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('userID');
      Backbone.history.navigate('login', {trigger: true});
    },

    rerouteIfLoggedIn: function(fragment, args, next) {
      console.log('rerouteIfLoggedIn');
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