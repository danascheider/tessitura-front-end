Tessitura.DashboardNavView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  tagName            : 'nav',
  className          : 'navbar navbar-default navbar-fixed-top',
  template           : JST['partials/dashNav'],

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
    'click .navbar-header'   : 'toggleSidebar',
    'click li.dropdown'      : 'toggleDropdownMenu',
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
    this.model = user;

    this.listenTo(this.model, 'change:first_name change:last_name', this.render);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize         : function(opts) {
    opts = opts || {};

    this.sidebarView = new Tessitura.DashboardSidebarView();

    this.childViews  = [this.sidebarView];
    if(opts.user) { this.setUser(opts.user); }
  },

  remove             : function() {
    _.each(this.childViews, function(view) {
      view.remove();
    });

    Tessitura.View.prototype.remove.call(this);
  },

  render             : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(that.model.attributes), function() {
      that.sidebarView.render();
      that.$('div.sidebar-collapse').html(that.sidebarView.$el);
    });
  }
});

module.exports = Tessitura.DashboardNavView;