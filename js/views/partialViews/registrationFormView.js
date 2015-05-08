var RegistrationFormView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/regForm'],
  tagName     : 'form',
  id          : 'registration-form',

  events      : {
    'submit' : 'createUser'
  },

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'RegistrationFormView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['RegistrationFormView', 'RegistrationForm', 'FormView', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  createUser  : function(e) {
    e.preventDefault();

    var data = Canto.Utils.getAttributes(this.$el);
    if(!this.validateForm(data)) { return; }

    var user = new Canto.UserModel(),
        hash = btoa(data.username + ':' + data.password),
        that = this;

    user.save(data, {
      success: function(model) {
        $.cookie('auth', hash);
        $.cookie('userID', model.id);
        that.trigger('userCreated');
      } 
    });
  },

  /* Special Functions
  /**************************************************************************/

  validateForm: function(data) {
    if(!data.acceptTerms) { return false; }
    delete data.acceptTerms
    return this.validCreds(data.username, data.password, data.email) && this.validName(data.first_name, data.last_name);
  },

  /* Form Validations
  /**************************************************************************/
  validCreds   : function(username, password, email) {
    return this.validPassword(password) && this.validUsername(username) && this.validEmail(email) && password.indexOf(username) === -1;
  },

  validEmail   : function(email) {
    return !!email.match(/(\S+)@(\S+)\.(\S+)/);
  },

  validName    : function(first, last) {
    return !!first.match(/^[A-Za-z' -]{2,}$/) && !!last.match(/^[A-Za-z\' -]{2,}$/);
  },

  validPassword: function(password) {
    return !!password && password.length >= 8 && !!password.match(/[A-Za-z]/) && !!password.match(/[0-9]/);
  },

  // FIX: The back end requires the username to be 8 characters so one of these needs to change.
  validUsername: function(name) {
    return !!name && name.length >= 6;
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = RegistrationFormView;