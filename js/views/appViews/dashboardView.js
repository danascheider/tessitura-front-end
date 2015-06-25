Tessitura.DashboardView = Tessitura.View.extend({
  id         : 'dashboard-wrapper',
  template   : JST['dashboard'],

  events     : {
    'click .internal-link' : 'followLink'
  },

  emitRedirect: function(args) {
    this.trigger('redirect', args);
  },

  followLink : function(e) {
    var link = $(e.target).closest('.internal-link');
    var target = link.attr('data-target');
    this.emitRedirect({destination: target});
  },

  setUser    : function(model) {
    this.model = model;
    this.navView.setUser(model);
  },

  initialize : function() {
    this.navView = new Tessitura.DashboardNavView();

    if (this.model) { this.setUser(model); }
  },

  render     : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, '', function() {
      that.navView.render();
      if(!that.navView.$el.is(':visible')) { that.$el.prepend(that.navView.$el); }
    });
  }
});

module.exports = Tessitura.DashboardView;