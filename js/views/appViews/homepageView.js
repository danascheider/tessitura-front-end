/****************************************************************************
 *                                                                         *
 * HOMEPAGE VIEW                                                           *
 *                                                                         *
 * The homepage is the place where users who are not logged in land when   *
 * they visit the site. It is the place where they can get information     *  
 * about the product or log into their dashboard.                          *
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

/* Core Requires
/****************************************************************************/

Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('./cantoView.js');

/* Module-Specific Requires
/****************************************************************************/

var User = require('../../models/userModel.js'),
    LoginFormView = require('../partialViews/loginFormView.js');

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var HomepageView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['homepage'],
  id          : 'homepage-wrapper',

  events      : {
    'submit #registration-form' : 'createUser',
    'click nav li .login-link'  : 'toggleLoginForm',
    'dblclick #shade'           : 'hideLoginForm'
  },

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'HomepageView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['HomepageView', 'TopLevelView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  createUser  : function(e) {
    e.preventDefault();
    var that  = this,
        form  = $(e.target),
        attrs = Canto.Utils.getAttributes(form),
        hash  = btoa(attrs.username + ':' + attrs.password),
        user  = new User();

    user.save(attrs,  {
      url     : Canto.API.users.root,
      success : function(model) {
        $.cookie('userID', model.id);
        $.cookie('auth', hash);
        that.trigger('redirect', {destination: 'dashboard'});
      }
    });
  },

  hideLoginForm: function(e) {
    var t = $(e.target);
    if (t.attr('id') !== 'login-form' && this.loginForm.$el.has(t).length === 0) {
      this.$('#shade').hide();
      this.$('div.text-vertical-center').children().show();
    }
  },

  toggleLoginForm: function() {
    if(!!$.cookie('auth')) {
      this.trigger('redirect', {destination: 'dashboard'});
    } else {
      this.$('div.text-vertical-center').children().toggle();
      this.$('#shade').toggle();
    }
  },

  /* Core View Functions
  /**************************************************************************/

  initialize  : function() {
    this.loginForm = new LoginFormView();
  },

  remove      : function() {
    this.loginForm.remove();
    Canto.View.prototype.remove.call(this);
  },

  render      : function() {
    var that = this;

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.loginForm.render();
      that.$('#shade').html(that.loginForm.$el);
    });
  }
});

module.exports = HomepageView;