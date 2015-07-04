Tessitura.HomepageView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['homepage'],
  id          : 'homepage-wrapper',

  events      : {
    'click nav li .login-link' : 'toggleLoginForm',
    'dblclick #shade'          : 'hideLoginForm'
  },

  /* Tessitura View Properties
  /**************************************************************************/

  klass       : 'HomepageView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(['HomepageView', 'TopLevelView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  goToDashboard: function(e) {
    var args = _.extend(e, {destination: 'dashboard'});
    this.trigger('redirect', args);
  },

  hideLoginForm: function(e) {
    var t = $(e.target);

    /* istanbul ignore else */
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
    this.loginForm        = new Tessitura.LoginFormView();
    this.registrationForm = new Tessitura.RegistrationFormView();

    this.childViews       = [this.loginForm, this.registrationForm];
    
    this.listenTo(this.registrationForm, 'userCreated', this.goToDashboard);
    this.listenTo(this.loginForm, 'userLoggedIn', this.goToDashboard);
  },

  remove      : function() {
    this.loginForm.remove();
    this.registrationForm.remove();
    Tessitura.View.prototype.remove.call(this);
  },

  render      : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.registrationForm.render();
      that.$('section#register div.col-md-12').html(that.registrationForm.$el);

      that.loginForm.render();
      that.$('#shade').html(that.loginForm.$el);
    });
  }
});

module.exports = Tessitura.HomepageView;