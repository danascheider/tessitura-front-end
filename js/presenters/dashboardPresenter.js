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

    this.user.protectedFetch({
      success: function() {
        that.user.tasks.fetch({
          success: function(collection) {
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