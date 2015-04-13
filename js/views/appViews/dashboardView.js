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
 *   Canto View Properties .......... ............................... 59   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *     types                                                               *
 *   View Events .................................................... --   *
 *   Event Callbacks ................................................ --   *
 *     hideDropdownMenus() .......................................... --   *
 *     toggleDropdownMenu() ......................................... --   *
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

var DashboardView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  id                 : 'dashboard-wrapper',
  template           : JST['dashboard'],

  /* Canto View Properties   
  /**************************************************************************/

  klass              : 'DashboardView',
  family             : 'Canto.View',
  superFamily        : 'Backbone.View',

  types              : function() {
    return Canto.View.prototype.types().concat(['DashboardView', 'MainDashboardView', 'Dashboard', 'MainDashboard', 'TopLevelView']);
  },

  /* View Events                  
  /**************************************************************************/

  events             : {
    'click'                : 'hideDropdownMenus',
    'dblclick'             : 'hideSidebar',
    'click li.dropdown'    : 'toggleDropdownMenu',
    'click .navbar-header' : 'toggleSidebar'
  },

  /* Event Callbacks
  /**************************************************************************/

  hideDropdownMenus  : function(e) {
    var li = this.$('li.dropdown');
    if(!li.is(e.target) && !li.has(e.target).length) { li.removeClass('open'); }
  },

  hideSidebar        : function(e) {
    var target = $(e.target);

    if(target != this.sidebarView.$el && this.sidebarView.$el.has(target).length === 0 && this.sidebarView.$el.is(':visible')) {
      this.$('.sidebar-collapse').slideUp();
    }
  },

  toggleDropdownMenu : function(e) {
    var li = $(e.target).closest('li.dropdown');
    li.siblings().removeClass('open');
    li.toggleClass('open');
  },

  toggleSidebar      : function(e) {
    e.preventDefault();

    this.$('li.dropdown').removeClass('open');
    this.$('.sidebar-collapse').slideToggle();
  },

  /* Special Functions
  /**************************************************************************/

  setUser            : function(user) {
    this.user = user;
    this.homeView.setUser(user);
    this.taskView.setUser(user);

    this.listenTo(this.user, 'change:first_name change:last_name', this.render);
  },

  showHomeView       : function() {
    if(this.taskView.$el.is(':visible')) { this.taskView.remove(); }
    this.homeView.render();

    this.$('nav').after(this.homeView.$el);
  },

  showTaskView       : function() {
    if(!this.$el.is(':visible')) { this.render(); }
    if(this.homeView.$el.is(':visible')) { this.homeView.remove(); }

    this.taskView.render();
    this.$('nav').after(this.taskView.$el);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize         : function(opts) {
    opts = opts || {};

    this.sidebarView = new Canto.DashboardSidebarView();
    this.homeView    = new Canto.DashboardHomeView();
    this.taskView    = new Canto.DashboardTaskView();

    if(opts.user) { this.setUser(opts.user); }
  },

  remove             : function() {
    this.sidebarView.remove();
    Canto.View.prototype.remove.call(this);
    this.homeView.remove();
    this.taskView.remove();
  },

  render             : function() {
    var that = this;
    return Canto.View.prototype.render.call(this, this.template(that.user.attributes), function() {
      that.sidebarView.render();
      that.$('div.sidebar-collapse').html(that.sidebarView.$el);
    });
  }
});

module.exports = DashboardView;