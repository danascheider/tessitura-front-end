var UserProfileView = Tessitura.View.extend({
  className   : 'user-profile',
  template    : _.template('<div></div>'),

  /* Tessitura View Properties
  /**************************************************************************************/

  klass       : 'UserProfileView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(this.klass, 'UserView', 'DashboardProfileView');
  },

  /* Special Functions
  /**************************************************************************************/

  setUser   : function(user) {
    this.model = user;
    this.modelView = new Tessitura.UserModelView({model: user});
    this.childViews = [this.modelView];
    return this;
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize  : function(args) {
    args = args || {};
    if(args.model) { this.setUser(args.model); }
  },

  render      : function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = UserProfileView;