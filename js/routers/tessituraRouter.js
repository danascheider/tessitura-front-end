Tessitura.Router = Backbone.Router.extend({

  /* Static Properties
  /****************************************************************************/

  klass      : 'Tessitura.Router',
  types      : function() {
    return ['Tessitura.Router', 'Router', 'Backbone.Router'];
  },

  /* Special Functions
  /****************************************************************************/

  isA        : function(type) {
    return this.types().indexOf(type) > -1 ? true : false;
  },

  /* Core Router Functions
  /****************************************************************************/

  initialize : function() {
    this.DashboardPresenter = new Tessitura.DashboardPresenter();

    this.listenTo(this.DashboardPresenter, 'redirect', this.navigateTo);
  },

  /* Event Callbacks (non-route)
  /****************************************************************************/

  navigateTo         : function(obj) {
    var that = this;

    if(obj.user && ['dashboard', 'tasks', 'profile', 'local'].indexOf(obj.destination) > -1) {

      // The redirect:dashboard event is emitted with a user object when the
      // user logs in. The router should call `setUser` on the dashboard presenter
      // when it receives the user object. The `fetchUser` option is set to false
      // because the server has already sent the user in response to the login
      // request.

      this.DashboardPresenter.setUser(obj.user);
    }

    this.navigate(obj.destination, {trigger: true});
  },

  /* Special Functions
  /****************************************************************************/

  userLoggedIn       : function() {
    return !!$.cookie('userID') && !!$.cookie('auth');
  },

  /* Routes and Route Callbacks
  /****************************************************************************/

  routes: {
    'dashboard(/)'   : 'displayDashboardHome',
    'local(/)'       : 'displayDashboardLocal',
    'logout(/)'      : 'logOut',
    'prepare(/)'     : 'prepareTestEnvironment',
    'profile(/)'     : 'displayDashboardProfile',
    'tasks(/)'       : 'displayDashboardTaskView',
    '*actions'       : 'defaultAction'
  },

  before: {
    'dashboard(/)' : 'verifyLoggedIn',
    'tasks(/)'     : 'verifyLoggedIn',
    'profile(/)'   : 'verifyLoggedIn',
    'local(/)'     : 'verifyLoggedIn'
  },

  defaultAction            : function(action) {
    // FIX: In production this should render some sort of a 'missing
    //      resource' view since opera singers have an inexplicable
    //      tendency not to check their JavaScript consoles when a
    //      page doesn't load.
    console.log('No route for ', action);
  },

  displayDashboardHome     : function() {
    var that = this;

    this.DashboardPresenter.setUser(new Tessitura.UserModel({id: $.cookie('userID')}), function() {
      that.DashboardPresenter.getHome();
    });
  },

  displayDashboardLocal    : function() {
    var that = this;

    this.DashboardPresenter.setUser(new Tessitura.UserModel({id: $.cookie('userID')}), function() {
      that.DashboardPresenter.getLocal();
    });
  },

  displayDashboardProfile  : function() {
    var that = this;

    this.DashboardPresenter.setUser(new Tessitura.UserModel({id: $.cookie('userID')}), function() {
      that.DashboardPresenter.getProfile();
    });
  },

  displayDashboardTaskView : function() {
    var that = this;

    this.DashboardPresenter.setUser(new Tessitura.UserModel({id: $.cookie('userID')}), function() {
      that.DashboardPresenter.getTask();
    });
  },

  logOut                   : function() {
    $.removeCookie('auth');
    $.removeCookie('userID');
    // FIX: This should be changed in production to the correct base URL
    location.href = 'https://tessitura.io'
  },

  prepareTestEnvironment   : function() {
    $.ajax({
      type: 'POST',
      url: 'http://api.canto-test.com:1025/destroy'
    });
  },

  verifyLoggedIn           : function(fragment, args, next) {
    if(this.userLoggedIn()) { 
      next(); 
    } else {
      // FIX: This should be changed in production to the correct base URL
      location.href = 'https://tessitura.io'
    }
  }
});

module.exports = Tessitura.Router;