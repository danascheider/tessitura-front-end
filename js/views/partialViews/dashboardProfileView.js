Tessitura.DashboardProfileView = Tessitura.View.extend({
  className   : 'user-profile',
  id          : 'page-wrapper',
  template    : JST['partials/profile'],

  events      : {
    'click' : 'hideInputs'
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  types       : function() {
    return Tessitura.View.prototype.types().concat('DashboardView', 'DashboardProfileView');
  },

  /* Event Callbacks
  /**************************************************************************************/

  hideInputs: function(e) {
    /* istanbul ignore else */
    if(!$(e.target).is('input')) { this.profileView.hideInputs(); }
  },

  /* Special Functions
  /**************************************************************************************/

  setUser   : function(user) {
    this.model = user;
    this.profileView = new Tessitura.UserProfileView({model: user});
    this.childViews = [this.profileView];
    return this;
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize  : function(args) {
    args = args || {};
    if(args.model) { this.setUser(args.model); }
    _.bindAll(this, 'hideInputs');
  },

  render      : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.profileView.render();
      that.$('.col-md-8').html(that.profileView.$el);
    });
  }
});

module.exports = Tessitura.DashboardProfileView;