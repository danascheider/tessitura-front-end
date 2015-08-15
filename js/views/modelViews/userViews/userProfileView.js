Tessitura.UserProfileView = Tessitura.DashWidgetView.extend({
  id          : 'profile-info',
  template    : JST['users/profile'],

  events      : {
    'click' : 'hideInputs'
  },

  /* Event Callbacks
  /**************************************************************************************/

  hideInputs  : function() {
    this.modelView.hideInputs();
  },

  updateTitle : function() {
    var str = this.model.escape('first_name') + ' ' + this.model.escape('last_name') + "'s Profile";
    this.$('h4').html(str);
  },

  /* Special Functions
  /**************************************************************************************/

  setUser     : function(user) {
    this.model = user;
    this.modelView = new Tessitura.UserModelView({model: user});
    this.childViews = [this.modelView];
    this.listenTo(this.model, 'change:first_name change:last_name', this.updateTitle);
    return this;
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize    : function(args) {
    args = args || {};

    _.extend(this.events, Tessitura.DashWidgetView.prototype.events);

    if(args.model) { this.setUser(args.model); }
  },

  render        : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template({model: that.model}), function() {
      that.modelView.render();
      that.$('#profile-tab > h4').first().after(that.modelView.$el);
    });
  }
});

module.exports = Tessitura.UserProfileView;