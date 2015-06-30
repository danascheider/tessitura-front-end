Tessitura.LoginFormView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/loginForm'],
  tagName     : 'form',
  id          : 'login-form',

  events      : {
    'submit'                 : 'loginUser',
    'click .login-help-link' : 'loginHelp'
  },

  /* Event Callbacks
  /**************************************************************************/

  loginHelp   : function(e) {
    console.log('Haha, you\'re boned!');
  },

  loginUser   : function(e) {
    e.preventDefault();

    var loginInfo = Tessitura.Utils.getAttributes(this.$el),
        hash      = btoa(loginInfo.username + ':' + loginInfo.password),
        that      = this;

    var user = new Tessitura.UserModel({username: loginInfo.username, password: loginInfo.password});

    user.login({
      success    : function(model) {
        loginInfo.remember ? $.cookie('auth', hash, {expires: 365}) : $.cookie('auth', hash);
        loginInfo.remember ? $.cookie('userID', user.id, {expires: 365}) : $. cookie('userID', user.get('id'));
        that.trigger('userLoggedIn', {user: model});
      }
    });
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.LoginFormView;