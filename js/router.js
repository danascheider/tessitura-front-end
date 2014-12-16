define([
  'jquery', 
  'underscore', 
  'backbone', 
  'filter',
  'models/app-presenter',
  'models/dashboard-presenter',
  'models/user',
  'views/app/login-form',
  'views/app/dashboard',
  'views/app/homepage',
  'cookie'
], function(
    $, 
    _, Backbone, 
    Filter,
    AppPresenter,
    DashboardPresenter,
    UserModel,
    LoginView, 
    DashboardView,
    HomepageView,
    DashboardHomeView
) {
  
  var CantoRouter = Backbone.Router.extend({
    initialize         : function() {
      if($.cookie('auth')) {
        var user = new UserModel({id: $.cookie('userID')});
        this.dashboardPresenter = new DashboardPresenter({user: user});
      }

      this.listenTo(this.appPresenter, 'userLoggedIn', this.prepareDashboard);
    },

    appPresenter : new AppPresenter(),

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
      this.dashboardPresenter.getHome();
    },

    displayKanban: function() {
      this.dashboardPresenter.getKanban();
    },

    displayHomepage: function() {
      if(!!this.dashboardPresenter) { this.dashboardPresenter.removeAll(); }
      $('body').prepend(this.appPresenter.getHomepage());
    },

    displayLogin: function() {
      if(!!this.dashboardPresenter) { this.dashboardPresenter.removeAll(); }
      $('body').prepend(this.appPresenter.getLoginPage());
    },

    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('userID');
      Backbone.history.navigate('login', {trigger: true});
    },

    prepareDashboard : function() {
      var user = new UserModel({id: $.cookie('userID')});
      this.dashboardPresenter = new DashboardPresenter({user: user});
      this.dashboardPresenter.getMain('body');

      Backbone.history.navigate('dashboard', {trigger: true});
    },

    rerouteIfLoggedIn: function(fragment, args, next) {
      if (!$.cookie('auth')) {
        next();
      } else {
        this.appPresenter.removeAll();
        this.prepareDashboard();
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