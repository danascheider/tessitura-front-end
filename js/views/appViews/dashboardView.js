/***************************************************************************
 *                                                                         *
 * TOP-LEVEL DASHBOARD VIEW                                                *
 *                                                                         *
 * The dashboard is the user's main view from which they manage            *
 * everything. The dashboard displays summary information about their      *
 * affairs and links to all their other pages.                             *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 33   *
 * Module-Specific Requires ......................................... 39   *
 * Module ........................................................... 47   *
 *   Backbone View Properties ....................................... 52   *
 *   Tessitura View Properties .......... ........................... 59   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *     types                                                               *
 *   View Events .................................................... --   *
 *   Event Callbacks ................................................ --   *
 *     hideDropdownMenus() .......................................... --   *
 *     toggleDropdownMenu() ......................................... 97   *
 *   Special Functions .............................................. 69   *
 *     setUser() .................................................... 69   *
 *     showHomeView() ............................................... 74   *
 *     showTaskView() ............................................... 85   *
 *   Core Functions ................................................. 97   *
 *     initialize() ................................................. 97   *
 *     remove() .................................................... 105   *
 *     render() .................................................... 111   *
 *                                                                         *
/***************************************************************************/

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var DashboardView = Tessitura.View.extend({

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
    'dblclick'               : 'hideSidebar',
    'click li.dropdown'      : 'toggleDropdownMenu',
    'click .navbar-header'   : 'toggleSidebar',
    'click a.dashboard-link' : 'redirectToDashboard',
    'click a.task-page-link' : 'redirectToTaskPage',
    'click a.link'           : 'redirectToHref'
  },

  /* Event Callbacks
  /**************************************************************************/

  emitRedirect       : function(args) {
    if(args.destination === 'dashboard') { 
      this.redirectToDashboard(); 
    } else {
      this.redirectToTaskPage();
    }
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

  redirectToHref     : function(e) {
    var a = $(e.target).closest('a'),
        destination = a.attr('href').replace('/#', '');

    this.trigger('redirect', {destination: destination});
  },

  redirectToTaskPage : function() {
    this.trigger('redirect', {destination: 'tasks'});
    this.$('.sidebar-collapse').slideUp();
  },

  toggleDropdownMenu : function(e) {
    var li = $(e.target).has('li');
    li.toggleClass('open');
    $(e.target).blur();
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

    this.listenTo(this.user, 'change:first_name change:last_name', this.render);
  },

  showHomeView       : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    var that = this;
    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== that.homeView && view !== that.sidebarView) {
        view.remove();
      }
    })

    this.homeView.render();
    this.$('nav').after(this.homeView.$el);
  },

  showProfileView    : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    var that = this;
    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== that.profileView && view !== that.sidebarView) {
        view.remove();
      }
    });

    this.profileView.render();
    this.$('nav').after(this.profileView.$el);
  },

  showTaskView       : function() {
    if(!this.$el.is(':visible')) { this.render(); }

    var that = this;
    _.each(this.childViews, function(view) {
      if(view.$el.is(':visible') && view !== that.taskView && view!== that.sidebarView) {
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
    this.profileView = new Tessitura.UserProfileView();
    this.taskView    = new Tessitura.DashboardTaskView();

    this.childViews  = [this.sidebarView, this.homeView, this.profileView, this.taskView];
    if(opts.user) { this.setUser(opts.user); }

    this.listenTo(this.homeView, 'all', this.emitRedirect);
  },

  remove             : function() {
    this.sidebarView.remove();
    Tessitura.View.prototype.remove.call(this);
    this.homeView.remove();
    this.taskView.remove();
  },

  render             : function() {
    var that = this;
    return Tessitura.View.prototype.render.call(this, this.template(that.user.attributes), function() {
      that.sidebarView.render();
      that.$('div.sidebar-collapse').html(that.sidebarView.$el);
    });
  }
});

module.exports = DashboardView;