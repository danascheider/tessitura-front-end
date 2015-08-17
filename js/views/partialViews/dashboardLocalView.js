Tessitura.DashboardLocalView = Tessitura.View.extend({
  id         : 'page-wrapper',
  setUser    : function(user) {
    this.user = user;
  },

  initialize : function(opts) {
    opts = opts || {};
    opts.user && this.setUser(opts.user);
  }
});

module.exports = Tessitura.DashboardLocalView;