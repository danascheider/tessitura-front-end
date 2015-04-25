/* ***************************************************************************************\
 * DASHBOARD PRESENTER                                                                   *
\*****************************************************************************************/

var DashboardPresenter = Canto.Model.extend({

  /* Canto Model Properties
  /***************************************************************************************/

  klass        : 'DashboardPresenter',
  types        : function() {
    return Canto.Model.prototype.types().concat(['Presenter', 'DashboardPresenter']);
  },

  /* Event Callbacks
  /***************************************************************************************/

  getHome      : function() {
    this.showDash();
    this.dashboardView.showHomeView();
    this.current = 'home';
  },

  getTask      : function() {
    this.showDash();
    this.dashboardView.showTaskView();
    this.current = 'task';
  },

  emitRedirect : function(opts) {
    this.trigger('redirect', opts);
  },

  /* Special Functions
  /***************************************************************************************/

  removeAll    : function() {
    this.dashboardView.remove();
  },

  setUser      : function(user, callback) {
    var that = this;

    if(this.user && this.user.get('id') === user.get('id')) { return; }
    this.user = user;
    this.user.tasks = user.tasks || new Canto.TaskCollection();

    // Fetch the user using stored credentials

    this.user.protectedFetch({
      success: function() {

        // Once the user has been fetched successfully, send a request for their
        // task collection this works if the initial request for the user is 
        // unsuccessful, causing this to act more like a sequence of synchronous 
        // fetches, which Chrome has informed me is "deprecated" due to "user experience".

        that.user.tasks.fetch({
          success: function(collection) {

            // When the user and their tasks have been fetched successfully, then set
            // user on the dashboard view. At this point, if any callback has been passed
            // to the setUser function, it will be executed with the task collection as
            // an argument.

            that.dashboardView.setUser(user);
            if(callback) { callback(collection); }
          }
        });
      }
    });
  },

  showDash     : function() {
    if(!this.dashboardView.$el.is(':visible')) {
      this.dashboardView.render();
      $('body').html(this.dashboardView.$el);
    }
  },

  /* Core Model Functions
  /***************************************************************************************/

  initialize   : function(opts) {
    opts = opts || {};
    this.dashboardView = new Canto.DashboardView();
    
    if(!!opts.user) { this.setUser(opts.user) }

    _.bindAll(this, 'showDash', 'getHome', 'getTask', 'setUser', 'emitRedirect', 'removeAll');
    this.listenTo(this.dashboardView, 'redirect', this.emitRedirect);
  }
});

module.exports = DashboardPresenter;