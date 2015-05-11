var RegistrationFormView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/regForm'],
  tagName     : 'form',
  id          : 'registration-form',

  events      : {
    'click input[type=checkbox]' : 'removeError',
    'submit'                     : 'createUser'
  },

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'RegistrationFormView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['RegistrationFormView', 'RegistrationForm', 'FormView', 'PartialView']);
  },

  /* Special Properties
  /**************************************************************************/

  reqdFields  : ['username', 'password', 'email', 'first_name', 'last_name'],

  /* Event Callbacks
  /**************************************************************************/

  createUser  : function(e) {
    e.preventDefault();

    var data = Canto.Utils.getAttributes(this.$el);

    if(!this.validateForm(data)) { 
      return;
    }

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

  removeError : function() {
    if(this.$('fieldset.terms').hasClass('has-error')) { this.$('fieldset.terms').removeClass('has-error'); }
  },

  /* Special Functions
  /**************************************************************************/

  validateForm: function(data) {
    if(!data.acceptTerms) { 
      this.$('div.form-group.terms').addClass('has-error');
      return false; 
    }

    delete data.acceptTerms
    return this.validCreds(data.username, data.password, data.email) && this.validName(data.first_name, data.last_name);
  },

  /* Form Validations
  /**************************************************************************/
  validCreds   : function(username, password, email)
    return this.validPassword(password) && this.validUsername(username) && this.validEmail(email) && password.indexOf(username) === -1;
  },

  validEmail   : function(email) {
    var valid = !!email.match(/(\S+)@(\S+)\.(\S+)/);
    if (!valid) { this.$('input[name=email]').addClass('has-error') }
    return valid;
  },

  validName    : function(first, last) {
    var first_valid = !!first.match(/^[A-Za-z' -]{2,}$/),
        last_valid  = !!last.match(/^[A-Za-z\' -]{2,}$/);

    if (!first_valid) { this.$('input[name=first_name]').addClass('has-error'); }
    if (!last_valid) { this.$('input[name=last_name]').addClass('has-error'); }
    return valid;
  },

  validPassword: function(password) {
    var valid = !!password && password.length >= 8 && !!password.match(/[A-Za-z]/) && !!password.match(/[0-9]/);
    if (!valid) { this.$('input[name=password]').addClass('has-error') }
    return valid;
  },

  validUsername: function(name) {
    var valid = !!name && name.length >= 8;
    if (!valid) { this.$('input[name=username]').addClass('has-error') }
    return valid;
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = RegistrationFormView;