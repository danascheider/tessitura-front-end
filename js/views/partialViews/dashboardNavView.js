  Tessitura.DashboardNavView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  tagName            : 'nav',
  className          : 'navbar navbar-default navbar-fixed-top',
  template           : JST['partials/dashNav'],

  /* Tessitura View Properties   
  /**************************************************************************/

  klass              : 'DashboardNavView',
  family             : 'Tessitura.View',
  superFamily        : 'Backbone.View',

  types              : function() {
    return Tessitura.View.prototype.types().concat(['DashboardView', 'DashboardNavView', 'PartialView']);
  },

  /* View Events                  
  /**************************************************************************/

  events             : {
    'click .navbar-brand'    : 'toggleSidebar',
    'click li.dropdown'      : 'toggleDropdownMenu',
  },

  /* Event Callbacks
  /**************************************************************************/

  emitRedirect       : function(args) {
    args = args || /* istanbul ignore next */ {};
    this.$('.sidebar-collapse').slideUp();
    this.trigger('redirect', {destination: args.destination});
  },

  redirectToDashboard: function() {
    this.emitRedirect({destination: 'dashboard'});
  },

  redirectToProfile  : function() {
    this.emitRedirect({destination: 'profile'});
  },

  redirectToTaskPage : function() {
    this.emitRedirect({destination: 'tasks'});
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
    /* istanbul ignore next */ if(opts.user || opts.model) { this.setUser(opts.user || opts.model); }
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