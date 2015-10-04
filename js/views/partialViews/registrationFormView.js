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

  validateForm: function(data) {
    if(!data.acceptTerms) { 
      this.$('fieldset.form-group.terms').addClass('has-error');
      return false; 
    }

    if(!data.username) {
      this.$('input[name=username]').addClass('has-error');
    }

    if(!data.password) {
      this.$('input[name=password]').addClass('has-error');
    }

    if(!data.passwordConfirmation) {
      this.$('input[name=passwordConfirmation]').addClass('has-error');
    }

    if(!data.email) {
      this.$('input[name=email]').addClass('has-error');
    }

    if(!data.emailConfirmation) {
      this.$('input[name=emailConfirmation]').addClass('has-error');
    }

    if(!data.first_name) {
      this.$('input[name=first_name]').addClass('has-error');
    }

    if(!data.last_name) {
      this.$('input[name=last_name]').addClass('has-error');
    }

    delete data.acceptTerms;

    return this.validCreds(data.username, data.password, data.passwordConfirmation, data.email, data.emailConfirmation) && this.validName(data.first_name, data.last_name);
  },

  /* Form Validations
  /**************************************************************************/

  validCreds   : function(username, password, passwordConfirmation, email, emailConfirmation) {
    return this.validPassword(password, passwordConfirmation) && this.validUsername(username) && this.validEmail(email, emailConfirmation) && password.indexOf(username) === -1;
  },

  validEmail   : function(email, confirmation) {
    var valid = !!email.match(/(\S+)@(\S+)\.(\S+)/) && !!confirmation && confirmation === email;
    if (!valid) { this.$('input[name=email]').addClass('has-error') }
    return valid;
  },

  validName    : function(first, last) {
    var first_valid = !!first.match(/^[A-Za-z' -]{2,}$/),
        last_valid  = !!last.match(/^[A-Za-z\' -]{2,}$/);

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