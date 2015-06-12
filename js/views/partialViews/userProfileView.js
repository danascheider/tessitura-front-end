var UserProfileView = Tessitura.View.extend({
  template: _.template('<div></div>'),

  /* Tessitura View Properties
  /**************************************************************************************/

  klass  : 'UserProfileView',

  /* Special Functions
  /**************************************************************************************/

  setUser: function(user) {
    this.model = user;
    this.modelView = new Tessitura.UserModelView({model: user});
    this.childViews = [this.modelView];
  },

  /* Core View Functions
  /**************************************************************************************/

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = UserProfileView;