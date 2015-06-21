Tessitura.DashboardView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  id                 : 'dashboard-wrapper',
  template           : JST['dashboard'],

  /* Tessitura View Properties   
  /**************************************************************************/

  klass              : 'DashboardView',
  family             : 'Tessitura.View',
  superFamily        : 'Backbone.View',

  types              : function() {
    return Tessitura.View.prototype.types().concat(['DashboardView', 'MainDashboardView', 'Dashboard', 'MainDashboard', 'TopLevelView']);
  },

  /* View Events                  
  /**************************************************************************/

  events             : {
    'click'                  : 'hideDropdownMenus',
    'click .internal-link'   : 'followLink',
    'dblclick'               : 'hideSidebar',
    'click .navbar-header'   : 'toggleSidebar',
  },

  /* Event Callbacks
  /**************************************************************************/

  emitRedirect       : function(args) {
    if(args.destination === 'dashboard') { 
      this.redirectToDashboard(); 
    } else if (args.destination === 'tasks') {
      this.redirectToTaskPage();
    } else {
      this.redirectToProfile();
    }
  },

  followLink         : function(e) {
    var link = $(e.target).closest('.internal-link');
    var target = link.attr('data-target');
    this.emitRedirect({destination: target});
  },

  hideDropdownMenus  : function(e) {
    var li = this.$('li.dropdown');
    if(!li.is(e.target) && !li.has(e.target).length) { li.removeClass('open'); }
  },

  hideSidebar        : function(e) {
    var target = $(e.target);

    if(target != this.sidebarView.$el && this.$('.navbar-static-side').has(target).length === 0 && this.sidebarView.$el.is(':visible')) {
      this.$('.sidebar-collapse').hide();
    }
  },

  redirectToDashboard: function() {
    this.trigger('redirect', {destination: 'dashboard'});
    this.$('.sidebar-collapse').slideUp();
  },

  redirectToProfile  : function() {
    this.trigger('redirect', {destination: 'profile'});
    this.$('.sidebar-collapse').slideUp();
  },

  redirectToTaskPage : function() {
    this.trigger('redirect', {destination: 'tasks'});
    this.$('.sidebar-collapse').slideUp();
  },

  toggleSidebar      : function() {
    this.$('li.dropdown').removeClass('open');
    this.$('.sidebar-collapse').slideToggle();
  },

  /* Special Functions
  /**************************************************************************/

  setUser            : function(user) {
    this.user = user;
    this.homeView.setUser(user);
    this.profileView.setUser(user);
    this.taskView.setUser(user);
    this.topNavView.setUser(user);
  },

  showHomeView       : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== this.sidebarView && view !== this.homeView) {
        view.remove();
      }
    });

    this.homeView.render();
    this.$('nav').after(this.homeView.$el);
  },

  showProfileView    : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== this.sidebarView && view !== this.profileView) {
        view.remove();
      }
    });

    this.profileView.render();
    this.$('nav').after(this.profileView.$el);
  },

  showTaskView       : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== this.sidebarView && view !== this.taskView) {
        view.remove();
      }
    });

    this.taskView.render();
    this.$('nav').after(this.taskView.$el);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize         : function(opts) {
    opts = opts || {};

    this.sidebarView = new Tessitura.DashboardSidebarView();
    this.homeView    = new Tessitura.DashboardHomeView();
    this.profileView = new Tessitura.DashboardProfileView();
    this.taskView    = new Tessitura.DashboardTaskView();
    this.topNavView  = new Tessitura.DashboardTopNavView();

    this.childViews  = [this.sidebarView, this.topNavView, this.homeView, this.profileView, this.taskView];
    if(opts.user) { this.setUser(opts.user); }

    this.listenTo(this.homeView, 'all', this.emitRedirect);
    this.listenTo(this.topNavView, 'redirect', this.emitRedirect);
  },

  remove             : function() {
    _.each(this.childViews, function(view) {
      view.remove();
    });

    Tessitura.View.prototype.remove.call(this);
  },

  render             : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.sidebarView.render();
      that.topNavView.render();
      that.$('div.sidebar-collapse').html(that.sidebarView.$el);
      that.$('.navbar-header').after(that.topNavView.$el);
    });
  }
});

module.exports = Tessitura.DashboardView;