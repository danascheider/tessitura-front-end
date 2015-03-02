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
      this.appPresenter = new AppPresenter();
      this.dashboardPresenter = new DashboardPresenter();

      this.listenTo(this.appPresenter, 'redirect', this.navigate);
      this.listenTo(this.dashboardPresenter, 'redirect', this.navigate);
    },

    // --------------------------- //
    // Event Callbacks (Non-Route) //
    // --------------------------- //

    navigate           : function(obj) {
      this.navigate(obj.destination);
    },

    routes: {
      '(/)'            : 'displayHomepage',
      'home(/)'        : 'displayHomepage',
      'dashboard(/)'   : 'displayDashboardHome',
      'tasks(/)'       : 'displayTaskView',
      'logout(/)'      : 'logOut',
      'spec(/)'        : 'runSpec',
      '*actions'       : 'defaultAction'
    },

    before: {
      'dashboard(/)' : 'verifyLoggedIn',
      'tasks(/)'     : 'verifyLoggedIn',
      '(/)'          : 'rerouteIfLoggedIn'
    },

    // --------------- //
    // Route Callbacks //
    // --------------- //

    defaultAction: function(action) {
      // FIX: In production this should render some sort of a 'missing
      //      resource' view since opera singers have an inexplicable
      //      tendency not to check their JavaScript consoles when a
      //      page doesn't load.
      console.log('No route for ', action);
    },

    displayDashboardHome: function() {
      if(!this.dashboardPresenter.user) { this.dashboardPresenter.setUser(new UserModel({id: $.cookie('userID')})); }
      this.dashboardPresenter.getHome();
    },

    displayTaskView: function() {
      if(!this.dashboardPresenter.user) { this.dashboardPresenter.setUser(new UserModel({id: $.cookie('userID')})); }
      this.dashboardPresenter.getTask();
    },

    displayHomepage: function() {
      this.dashboardPresenter.removeAll();
      this.appPresenter.getHomepage('body');
    },

    logOut: function() {
      $.removeCookie('auth');
      $.removeCookie('userID');
      this.navigate('', {trigger: true});
    },

    rerouteIfLoggedIn: function(fragment, args, next) {
      if (!$.cookie('auth')) {
        next();
      } else {
        this.appPresenter.removeAll();
        this.navigate('#dashboard', {trigger: true});
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
        this.navigate('', {trigger: true});
      }
    }
  });

  return CantoRouter;
});