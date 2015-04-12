/****************************************************************************
 *                                                                         *
 * LOGIN FORM VIEW                                                         *
 *                                                                         *
 * The login form is displayed on the homepage when the user clicks the    *
 * .login-link item on the homepage top nav. It provides fields for the    *  
 * username and password, a "remember-me" checkbox, and a login help link. *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 26   *
 * Suite ............................................................ 44   *
 *   Filters ........................................................ 50   *
 *   Authorization and Authentication ............................... 60   *
 *     token()                                                             *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/****************************************************************************/

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var LoginFormView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/loginForm'],
  tagName     : 'form',
  id          : 'login-form',

  events      : {
    'submit'                 : 'loginUser',
    'click .login-help-link' : 'loginHelp'
  },

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'LoginFormView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['LoginFormView', 'LoginForm', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  loginHelp   : function(e) {
    console.log('Haha, you\'re boned!');
  },

  loginUser   : function(e) {
    e.preventDefault();

    var loginInfo = Canto.Utils.getAttributes(this.$el),
        hash      = btoa(loginInfo.username + ':' + loginInfo.password),
        that      = this;

    var user = new Canto.UserModel({username: loginInfo.username, password: loginInfo.password});

    user.login({
      async      : false,
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
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = LoginFormView;