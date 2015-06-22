Tessitura.UserProfileView = Tessitura.DashWidgetView.extend({
  id          : 'profile-info',
  template    : JST['users/profile'],

  events      : function() {
    var events = Tessitura.DashWidgetView.prototype.events
    events['click'] = 'hideInputs'
    return events;
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  klass       : 'UserProfileView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(this.klass, 'UserView', 'ProfileView');
  },

  /* Event Callbacks
  /**************************************************************************************/

  hideInputs: function() {
    this.modelView.hideInputs();
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

module.exports = Tessitura.UserProfileView;