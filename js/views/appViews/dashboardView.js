Tessitura.DashboardView = Tessitura.View.extend({
  id         : 'dashboard-wrapper',
  template   : JST['dashboard'],

  events     : {
    'click'                            : 'hideDropdownMenus',
    'dblclick'                         : 'hideSidebar',
    'click .internal-link'             : 'followLink',
    'dblclick #shade'                  : 'hideShade'
  },
  
  /* Event Callbacks
  /**************************************************************************************/

  emitRedirect: function(args) {
    this.trigger('redirect', args);
  },

  followLink : function(e) {
    var link = $(e.target).closest('.internal-link');
    var target = link.attr('data-target');
    this.emitRedirect({destination: target});
  },

  hideDropdownMenus  : function(e) {
    var li = this.$('li.dropdown');
    if(!li.is(e.target) && !li.has(e.target).length) { li.removeClass('open'); }
  },

  hideShade          : function(e) {
    var theUserClickedOnTheForm = e.type === 'dblclick' && $('form').has(e.target).length;

    if (!theUserClickedOnTheForm) { this.trigger('hideShade'); }
  },

  hideSidebar        : function(e) {
    if(e) { var target = $(e.target); }

    if(target !== this.$('#side-menu') && this.$('.navbar-static-side').has(target).length === 0 && this.$('#side-menu').is(':visible')) {
      this.$('.sidebar-collapse').slideUp();
    }
  },

  /* Special Functions
  /**************************************************************************************/

  setUser    : function(model) {
    this.model = model;
    this.navView.setUser(model);
    return this;
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize : function() {
    this.navView = new Tessitura.DashboardNavView();
    this.childViews = [this.navView];

    if (this.model) { this.setUser(this.model); }
  },

  render     : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.navView.render();
      if(!that.navView.$el.is(':visible')) { that.$el.prepend(that.navView.$el); }
    });
  }
});

module.exports = Tessitura.DashboardView;