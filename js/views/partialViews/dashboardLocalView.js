Tessitura.DashboardLocalView = Tessitura.View.extend({
  id         : 'page-wrapper',
  template   : JST['partials/dashLocal'],
  setUser    : function(user) {
    this.user = user;
  },

  initialize : function(opts) {
    opts = opts || {};
    opts.user && this.setUser(opts.user);
  },

  render     : function() {
    var html = this.template({model: this.user});
    return Tessitura.View.prototype.render.call(this, html);
  }
});

module.exports = Tessitura.DashboardLocalView;