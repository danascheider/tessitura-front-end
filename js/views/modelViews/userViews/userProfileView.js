var UserProfileView = Tessitura.View.extend({
  className   : 'user-profile',
  id          : 'page-wrapper',
  template    : JST['users/profile'],

  events      : {
    'click' : 'hideInputs'
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  klass       : 'UserProfileView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(this.klass, 'UserView', 'DashboardProfileView');
  },

  /* Event Callbacks
  /**************************************************************************************/

  hideInputs: function(e) {
    if(!$(e.target).is('input')) { this.modelView.hideInputs(); }
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
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template({model: that.model}), function() {
      that.modelView.render();
      that.$('#profile-tab > h4').first().after(that.modelView.$el);
    });
  }
});

module.exports = UserProfileView;