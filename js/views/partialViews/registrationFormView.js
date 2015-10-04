Tessitura.RegistrationFormView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/regForm'],
  tagName     : 'form',
  id          : 'registration-form',

  events      : {
    'click input[type=checkbox]'   : 'removeError',
    'click label[for=acceptTerms]' : 'toggleCheckbox',
    'submit'                       : 'createUser'
  },

  /* Special Properties
  /**************************************************************************/


  // FIX: See if this is actually called anywhere
  reqdFields  : ['username', 'password', 'email', 'first_name', 'last_name'],

  /* Event Callbacks
  /**************************************************************************/

  createUser  : function(e) {
    e.preventDefault();

    var data = Tessitura.Utils.getAttributes(this.$el);

    if(!this.validateForm(data)) { 
      return;
    }

    var user = new Tessitura.UserModel(),
        hash = btoa(data.username + ':' + data.password),
        that = this;

    delete data.passwordConfirmation;
    delete data.emailConfirmation;

    user.save(data, {
      success: function(model) {
        $.cookie('auth', hash);
        $.cookie('userID', model.id);
        that.trigger('userCreated', {user: user});
      } 
    });
  },

  removeError : function() {
    this.$('fieldset.terms').removeClass('has-error');
  },

  toggleCheckbox: function() {
    var newVal = !this.$('input[name=acceptTerms]').prop('checked');
    this.$('input[name=acceptTerms]').prop(newVal);
    this.removeError();
  },

  /* Special Functions
  /**************************************************************************/

  // FIX: Don't return false until finished all validations
  validateForm: function(data) {
    var acceptTerms, validPassword, validUsername, validEmail, validName

    acceptTerms = !!data.acceptTerms

    if(!acceptTerms) {
      this.$('fieldset.form-group.terms').addClass('has-error');
      acceptTerms = false; 
    }

    validPassword = this.validPassword(data.password, data.passwordConfirmation);
    validUsername = this.validUsername(data.username);
    validEmail    = this.validEmail(data.email, data.emailConfirmation);
    validName     = this.validName(data.first_name, data.last_name);


    delete data.acceptTerms;

    return acceptTerms && validPassword && validUsername && validEmail && validName;
  },

  /* Form Validations
  /**************************************************************************/

  validCreds   : function(username, password, passwordConfirmation, email, emailConfirmation) {
    var validPassword = this.validPassword(password, passwordConfirmation),
        validUsername = this.validUsername(username),
        validEmail    = this.validEmail(email, emailConfirmation);

    return validPassword && validUsername && validEmail && password.indexOf(username) === -1;
  },

  validEmail   : function(email, confirmation) {
    var valid = !!email && !!email.match(/(\S+)@(\S+)\.(\S+)/) && !!confirmation && confirmation === email;
    if (!valid) { this.$('input[name=email]').addClass('has-error') }
    return valid;
  },

  validName    : function(first, last) {
    var first_valid = !!first && !!first.match(/^[A-Za-z' -]{2,}$/),
        last_valid  = !!last &&   !!last.match(/^[A-Za-z\' -]{2,}$/);

    if (!first_valid) { this.$('input[name=first_name]').addClass('has-error'); }
    if (!last_valid) { this.$('input[name=last_name]').addClass('has-error'); }
    return first_valid && last_valid;
  },

  validPassword: function(password, confirmation) {
    var valid = !!password && password.length >= 8 && !!password.match(/[A-Za-z]/) && !!password.match(/[0-9]/) && !!confirmation && password === confirmation;
    if (!valid) { this.$('input[name=password]').addClass('has-error') }
    return valid;
  },

  validUsername: function(name) {
    var valid = !!name && name.length >= 6 && !!name.match(/^[A-Za-z0-9_\- ]*$/);
    if (!valid) { this.$('input[name=username]').addClass('has-error') }
    return valid;
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.RegistrationFormView;