define([
  'backbone', 
  'filter',
  'models/appPresenter',
  'models/dashboardPresenter',
  'models/user',
  'views/spec/spec',
  'cookie'
], function(
    Backbone, 
    Filter,
    AppPresenter,
    DashboardPresenter,
    UserModel,
    SpecRunner
) {
  
  var CantoRouter = Backbone.Router.extend({
    initialize         : function() {
      if($.cookie('auth')) {

        // FIX: Should avoid using window.user with Require.js

        window.user = window.user || new UserModel({id: $.cookie('userID')});
      }

      this.appPresenter = new AppPresenter();
      this.dashboardPresenter = new DashboardPresenter();

      this.listenTo(this.appPresenter, 'userLoggedIn', this.prepareDashboard);
    },

    routes: {
      '(/)'            : 'displayHomepage',
      'home(/)'        : 'displayHomepage',
      'dashboard(/)'   : 'displayDashboard',
      'tasks(/)'       : 'displayKanban',
      'logout(/)'      : 'logOut',
      'spec(/)'        : 'runSpec',
      '*actions'       : 'defaultAction'
    },

    before: {
      'dashboard(/)' : 'verifyLoggedIn',
      'tasks(/)'     : 'verifyLoggedIn',
      '(/)'          : 'rerouteIfLoggedIn'
    },

    defaultAction: function(action) {
      // FIX: In production this should render some sort of a 'missing
      //      resource' view since opera singers have an inexplicable
      //      tendency not to check their JavaScript consoles when a
      //      page doesn't load.
      console.log('No route for ', action);
    },

    displayDashboard: function() {
      this.prepareDashboard();
      this.dashboardPresenter.getHome();
    },

    displayKanban: function() {
      this.dashboardPresenter.getKanban();
    },

    displayHomepage: function() {
      if(!!this.dashboardPresenter) { this.dashboardPresenter.removeAll(); }
      this.appPresenter.getHomepage('body');
    },

    // FIX: This probably belongs in the view that has the logout link
    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('userID');
      Backbone.history.navigate('', {trigger: true});
    },

    prepareDashboard : function() {
      var user = new UserModel({id: $.cookie('userID')});

      this.dashboardPresenter.setUser(user);
      this.dashboardPresenter.getMain();

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

    runSpec       : function() {
      if(!!this.appPresenter) { this.appPresenter.removeAll(); }
      if(!!this.dashboardPresenter) { this.dashboardPresenter.removeAll(); }
      this.specRunner = new SpecRunner({el: 'body'});
      $.removeCookie('auth');
      $.removeCookie('userID');
    },

    verifyLoggedIn: function(fragment, args, next) {
      if ($.cookie('auth')) {
        next();
      } else {
        alert('Please log in to view your dashboard.');
        Backbone.history.navigate('', {trigger: true});
      }
    }
  });

  return CantoRouter;
});