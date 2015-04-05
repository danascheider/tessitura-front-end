/* Core Requires
/******************************************************************************/

Canto = Canto || require('./dependencies.js');

/* Module-Specific Requires
/******************************************************************************/

require('../vendor/backbone-route-filter.js');

var AppPresenter       = require('./presenters/appPresenter.js'),
    DashboardPresenter = require('./presenters/dashboardPresenter.js');

/******************************************************************************
 * CANTO ROUTER SPEC                                                          *
/******************************************************************************/

Canto.Router = Backbone.Router.extend({

  /* Static Properties
  /****************************************************************************/

  klass      : 'Canto.Router',
  types      : function() {
    return ['Canto.Router', 'Router', 'Backbone.Router'];
  },

  /* Special Functions
  /****************************************************************************/

  isA        : function(type) {
    return this.types().indexOf(type) > -1 ? true : false;
  },

  /* Core Router Functions
  /****************************************************************************/

  initialize : function() {
    this.AppPresenter = new AppPresenter();
    this.DashboardPresenter = new DashboardPresenter();

    this.listenTo(this.AppPresenter, 'redirect', this.navigateTo);
    this.listenTo(this.DashboardPresenter, 'redirect', this.navigateTo);
  },

  /* Event Callbacks (non-route)
  /****************************************************************************/

  navigateTo         : function(obj) {
    this.navigate(obj.destination, {trigger: true});
  },

  /* Routes and Route Callbacks
  /****************************************************************************/

  routes: {
    '(/)'            : 'displayHomepage',
    'home(/)'        : 'displayHomepage',
    'dashboard(/)'   : 'displayDashboardHome',
    'tasks(/)'       : 'displayTaskView',
    'logout(/)'      : 'logOut',
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

  displayDashboardHome: function() {
    if(!this.DashboardPresenter.user) { this.DashboardPresenter.setUser(new UserModel({id: $.cookie('userID')})); }
    this.DashboardPresenter.getHome();
  },

  displayTaskView: function() {
    if(!this.DashboardPresenter.user) { this.DashboardPresenter.setUser(new UserModel({id: $.cookie('userID')})); }
    this.DashboardPresenter.getTask();
  },

  displayHomepage: function() {
    this.DashboardPresenter.removeAll();
    this.AppPresenter.getHomepage();
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
      this.AppPresenter.removeAll();
      this.navigate('dashboard', {trigger: true});
    }
  },

  verifyLoggedIn: function(fragment, args, next) {
    if ($.cookie('auth')) {
      next();
    } else {
      this.navigate('', {trigger: true});
    }
  }
});

module.exports = Canto.Router;