Tessitura.DashboardTopNavView = Tessitura.View.extend({
  tagName       : 'ul',
  id            : 'top-nav',
  className     : 'nav',
  template      : JST['partials/topNav'],

  events        : {
    'click li.dropdown' : 'toggleDropdownMenu'
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  klass       : 'DashboardTopNavView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',


  types         : function() {
    return Tessitura.View.prototype.types().concat(['DashboardTopNavView', 'TopNavView', 'DashboardView']);
  },

  /* Event Handlers
  /**************************************************************************************/

  toggleDropdownMenu : function(e) {
    var li = $(e.target).has('li');
    li.toggleClass('open');
    li.siblings('.dropdown').removeClass('open');
    $(e.target).blur();
  },
  
  /* Special Functions
  /**************************************************************************************/

  setUser     : function(user) {
    this.model = user;
    this.listenTo(this.model, 'sync', this.render);
    return this;
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize  : function(opts) {
    opts = opts || {};
    if(opts.model) { this.setUser(this.model); }
  },

  render      : function() {
    return Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  }
});

module.exports = Tessitura.DashboardTopNavView;