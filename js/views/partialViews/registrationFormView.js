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

  // FIX: Need some way to remove has-error class from any fields that might have it
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
    this.errors = this.errors || [];
    var validEmail = true, validConfirmation = true;

    if(!email) {
      this.errors.push('E-mail is required');
      validEmail = false;
    }

    if(!confirmation) {
      this.errors.push('E-mail confirmation is required');
      validConfirmation = false;
    }

    if(email && !email.match(/(\S+)@(\S+)\.(\S+)/)) {
      this.errors.push('Not a valid e-mail address');
      validEmail = false;
    }

    if(email && confirmation && email !== confirmation) {
      this.errors.push('E-mail and e-mail confirmation don\'t match');
      validEmail = false, validConfirmation = false;
    }

    if (!validEmail) { this.$('input[name=email]').addClass('has-error') }
    if (!validConfirmation) { this.$('input[name=emailConfirmation]').addClass('has-error') }

    return validEmail && validConfirmation;
  },

  validName    : function(first, last) {
    this.errors = this.errors || [];

    var firstValid = true, lastValid = true;

    if(!first) {
      this.errors.push('First name is required');
      firstValid = false;
    }

    if(!last) {
      this.errors.push('Last name is required');
      lastValid = false;
    }

    if(first && first.length < 2) {
      this.errors.push('First name must be at least 2 characters long');
      firstValid = false;
    }

    if(last && last.length < 2) {
      this.errors.push('Last name must be at least 2 characters long');
      lastValid = false;
    }

    if(first && !first.match(/^[A-Za-z\-' ]*$/)) {
      this.errors.push('First name may only contain letters, spaces, \', and -');
      firstValid = false;
    }

    if(last && !last.match(/^[A-Za-z\-' ]*$/)) {
      this.errors.push('Last name may only contain letters, spaces, \', and -');
      lastValid = false;
    }

    if (!firstValid) { this.$('input[name=first_name]').addClass('has-error'); }
    if (!lastValid) { this.$('input[name=last_name]').addClass('has-error'); }
    return firstValid && lastValid;
  },

  validPassword: function(password, confirmation) {
    var valid = !!password && password.length >= 8 && !!password.match(/[A-Za-z]/) && !!password.match(/[0-9]/) && !!confirmation && password === confirmation;
    if (!valid) { this.$('input[name=password]').addClass('has-error') }
    return valid;
  },

  validUsername: function(name) {
    this.errors = this.errors || [];
    var valid = true;

    if(!name) {
      valid = false;
      this.errors.push('Username is required');
    }

    if(name && name.length < 6) {
      valid = false;
      this.errors.push('Username must be at least 6 characters long');
    }

    if(name && !name.match(/^[A-Za-z0-9_\- ]*$/)) {
      valid = false;
      this.errors.push('Username may contain only alphanumeric characters, spaces, _, and -');
    }

    if (!valid) { this.$('input[name=username]').addClass('has-error') }
    return valid;
  },

  /* Core View Functions
  /**************************************************************************/

  initialize  : function() {
    this.errorPanelView = new Tessitura.ErrorPanelView();
  },

  render      : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.RegistrationFormView;