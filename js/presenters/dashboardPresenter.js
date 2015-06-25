Tessitura.DashboardPresenter = Tessitura.Model.extend({

  /* Tessitura Model Properties
  /***************************************************************************************/

  klass        : 'DashboardPresenter',
  types        : function() {
    return Tessitura.Model.prototype.types().concat(['Presenter', 'DashboardPresenter']);
  },

  /* Event Callbacks
  /***************************************************************************************/

  getHome      : function() {
    this.showDash();
    if(this.current !== this.dashboardHomeView) {
      this.dashboardHomeView.render();
      this.dashboardView.$('nav').after(this.dashboardHomeView.$el);
      this.current = this.dashboardHomeView;
    }
  },

  getProfile   : function() {
    this.showDash();
    if(this.current !== this.dashboardProfileView) {
      this.dashboardProfileView.render();
      this.dashboardView.$el.after(this.dashboardProfileView.$el);
      this.current = this.dashboardProfileView;
    }  
  },

  getTask      : function() {
    this.showDash();
    if(this.current !== this.dashboardTaskView) {
      this.dashboardTaskView.render();
      this.dashboardView.$('nav').after(this.dashboardTaskView.$el);
      this.current = this.dashboardTaskView;
    }
  },

  emitRedirect : function(opts) {
    this.trigger('redirect', opts);
  },

  /* Special Functions
  /***************************************************************************************/

  removeAll    : function() {
    this.dashboardView.remove();
  },

  rerender     : function() {
    if (this.current) {
      this.current.remove();
      this.dashboardView.render();
      this.dashboardView.$('nav').after(this.current.$el);
    }
  },

  setUser      : function(user, callback) {
    var that = this;

    // If this.user is already set, don't change it

    if(this.user && this.user.get('id') === user.get('id')) { return; }
    this.user = user;

    // Fetch the user using stored credentials

    this.user.fetch({
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

            _.each(that.views, function(view) {
              view.setUser && view.setUser(user);
            });

            if(callback) { callback(collection); }
          }
        });
      }
    });

    this.listenTo(this.user, 'change:first_name change:last_name', this.rerender);
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

    // Instantiate views

    this.dashboardView        = new Tessitura.DashboardView();
    this.dashboardHomeView    = new Tessitura.DashboardHomeView();
    this.dashboardTaskView    = new Tessitura.DashboardTaskView();
    this.dashboardProfileView = new Tessitura.DashboardProfileView();
    this.views                = [
                                  this.dashboardView, 
                                  this.dashboardHomeView,
                                  this.dashboardTaskView,
                                  this.dashboardProfileView
                                ];
    
    if(!!opts.user) { this.setUser(opts.user) }

    _.bindAll(this, 'showDash', 'getHome', 'getTask', 'setUser', 'emitRedirect', 'removeAll');
  
    this.listenTo(this.dashboardView, 'redirect', this.emitRedirect);
  }
});

module.exports = Tessitura.DashboardPresenter;