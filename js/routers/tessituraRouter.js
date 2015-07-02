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
    this.AppPresenter = new Tessitura.AppPresenter();
    this.DashboardPresenter = new Tessitura.DashboardPresenter();

    this.listenTo(this.AppPresenter, 'redirect', this.navigateTo);
    this.listenTo(this.DashboardPresenter, 'redirect', this.navigateTo);
  },

  /* Event Callbacks (non-route)
  /****************************************************************************/

  navigateTo         : function(obj) {
    var that = this;

    if(obj.user && ['dashboard', 'tasks'].indexOf(obj.destination) > -1) {

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
    '(/)'            : 'displayHomepage',
    'home(/)'        : 'displayHomepage',
    'dashboard(/)'   : 'displayDashboardHome',
    'tasks(/)'       : 'displayDashboardTaskView',
    'logout(/)'      : 'logOut',
    'prepare(/)'     : 'prepareTestEnvironment',
    'profile(/)'     : 'displayProfile',
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
    var that = this;
    var user = new Tessitura.UserModel({id: $.cookie('userID')});
    user.tasks = new Tessitura.TaskCollection();

    this.DashboardPresenter.setUser(new Tessitura.UserModel({id: $.cookie('userID')}), function() {
      that.DashboardPresenter.getHome();
    });
  },

  displayDashboardTaskView: function() {
    var that = this;
    var user = new Tessitura.UserModel({id: $.cookie('userID')});
    user.tasks = new Tessitura.TaskCollection();

    this.DashboardPresenter.setUser(user, function() {
      that.DashboardPresenter.getTask();
    });
  },

  displayHomepage: function() {
    this.DashboardPresenter.removeAll();
    this.AppPresenter.getHomepage();
  },

  displayProfile: function() {
    var that = this;
    var user = new Tessitura.UserModel({id: $.cookie('userID')});
    user.tasks = new Tessitura.TaskCollection();

    this.DashboardPresenter.setUser(user, function() {
      that.DashboardPresenter.getProfile();
    });
  },

  logOut: function() {
    $.removeCookie('auth');
    $.removeCookie('userID');
    this.navigate('', {trigger: true});
  },

  prepareTestEnvironment: function() {
    $.ajax({
      type: 'DELETE',
      url: 'http://api.canto-test.com:1025/destroy'
    });
  },

  rerouteIfLoggedIn: function(fragment, args, next) {
    /* istanbul ignore else */
    if (this.userLoggedIn()) {
      this.AppPresenter.removeAll();
      this.navigate('dashboard', {trigger: true});
    } else {
      next();
    }
  },

  verifyLoggedIn: function(fragment, args, next) {
    /* istanbul ignore if */
    if(this.userLoggedIn()) { 
      next(); 
    } else {
      this.navigate('/', {trigger: true});
    }
  }
});

module.exports = Tessitura.Router;