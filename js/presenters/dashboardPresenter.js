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

    var theViewNeedsToChange = this.current !== this.dashboardHomeView;
    this.current = this.dashboardHomeView;

    this.clearViews();

    if(theViewNeedsToChange) {
      this.dashboardView.hideSidebar();
      this.dashboardHomeView.render();
      this.dashboardView.$el.append(this.dashboardHomeView.$el);
    }
  },

  getLocal     : function() {
    this.showDash();

    var theViewNeedsToChange = this.current !== this.dashboardLocalView;
    this.current = this.dashboardLocalView;

    this.clearViews();

    if(theViewNeedsToChange) {
      this.dashboardView.hideSidebar();
      this.dashboardLocalView.render();
      this.dashboardView.$el.append(this.dashboardLocalView.$el);
    }
  },

  getProfile   : function() {
    this.showDash();

    var theViewNeedsToChange = this.current !== this.dashboardProfileView;
    this.current = this.dashboardProfileView;

    this.clearViews();

    if(theViewNeedsToChange) {
      this.dashboardView.hideSidebar();
      this.dashboardProfileView.render();
      this.dashboardView.$el.append(this.dashboardProfileView.$el);
    }  
  },

  getTask            : function() {
    this.showDash();

    var theViewNeedsToChange = this.current !== this.dashboardTaskView;
    this.current = this.dashboardTaskView;

    this.clearViews();

    if(theViewNeedsToChange) {
      this.dashboardView.hideSidebar();
      this.dashboardTaskView.render();
      this.dashboardView.$el.append(this.dashboardTaskView.$el);
    }
  },

  hideShade          : function() {
    if(this.editForm) { this.editForm.remove(); }
    if(this.taskCreateForm) { this.taskCreateForm.remove(); }
    this.dashboardView.$('#shade').hide();
  },

  emitRedirect       : function(opts) {
    this.trigger('redirect', opts);
  },

  showTaskCreateForm : function(collection, opts) {
    opts = opts || {};

    this.taskCreateForm = this.taskCreateForm || new Tessitura.TaskCreateFormView();
    this.taskCreateForm.status = opts.status;
    this.taskCreateForm.setCollection(collection).render();

    this.dashboardView.$('#shade').show();
    this.dashboardView.$('#shade').html(this.taskCreateForm.$el);
    this.taskCreateForm.$('input').first().focus();

    this.listenTo(this.taskCreateForm, 'hideShade', this.hideShade);
  },

  showTaskEditForm   : function(task) {
    this.editForm = this.editForm || new Tessitura.TaskEditFormView();
    this.editForm.setModel(task).render();
    this.dashboardView.$('#shade').show();
    this.dashboardView.$('#shade').html(this.editForm.$el);
    this.editForm.$('input').first().focus().select();

    this.listenTo(this.editForm, 'hideShade', this.hideShade);
  },

  /* Special Functions
  /***************************************************************************************/

  clearViews         : function() {
    var that = this;

    _.each(this.views, function(view) {
      if (view !== that.current && view !== that.dashboardView) { view.remove(); }
    });
  },

  removeAll          : function() {
    this.dashboardView.remove();
  },

  setUser            : function(user, callback) {
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
  },

  showDash           : function() {
    if(!this.dashboardView.$el.is(':visible')) {
      this.dashboardView.render();
      $('body').html(this.dashboardView.$el);
    }
  },

  /* Core Model Functions
  /***************************************************************************************/

  initialize         : function(opts) {
    opts = opts || {};

    // Instantiate views

    this.dashboardView        = new Tessitura.DashboardView();
    this.dashboardHomeView    = new Tessitura.DashboardHomeView();
    this.dashboardTaskView    = new Tessitura.DashboardTaskView();
    this.dashboardProfileView = new Tessitura.DashboardProfileView();
    this.dashboardLocalView   = new Tessitura.DashboardLocalView();

    this.views                = [
                                  this.dashboardView, 
                                  this.dashboardHomeView,
                                  this.dashboardTaskView,
                                  this.dashboardProfileView,
                                  this.dashboardLocalView
                                ];
    
    if(!!opts.user) { this.setUser(opts.user) }

    _.bindAll(this, 'showDash', 'getHome', 'getLocal', 'getTask', 'getProfile', 'setUser', 'emitRedirect', 'removeAll');
  
    this.listenTo(this.dashboardView, 'redirect', this.emitRedirect);
    this.listenTo(this.dashboardView, 'hideShade', this.hideShade);
    this.listenTo(this.dashboardHomeView, 'showTaskCreateForm', this.showTaskCreateForm);
    this.listenTo(this.dashboardTaskView, 'showTaskCreateForm', this.showTaskCreateForm);
    this.listenTo(this.dashboardTaskView, 'showEditForm', this.showTaskEditForm);
    this.listenTo(this.dashboardHomeView, 'showEditForm', this.showTaskEditForm);
  }
});

module.exports = Tessitura.DashboardPresenter;