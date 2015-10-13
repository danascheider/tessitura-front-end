var _          = require('underscore');

// Get the contents of a form when it is submitted
function getFormContents(form) {
  var data = $(form).serializeArray(), attributes = {};

  for(var key in data) {
    if(data.hasOwnProperty(key)) {
      var innerKey = data[key].name
      attributes[innerKey] = data[key].value
    }
  }

  return attributes;
}

// Create a template for an error panel that can be populated during form validation
var ErrorPanelTemplate = _.template(require('../templates/partialTemplates/errorPanelTemplate.js'));

// This object contains methods pertaining to form validation. It checks data
// passed into its `validateForm` method to ensure the presence of required
// attributes and check that the other fields comply with rules about data type,
// length, etc.
var validator = {
  requiredFields: {
    username            : 'Username',
    password            : 'Password',
    passwordConfirmation: 'Password confirmation',
    email               : 'E-mail',
    emailConfirmation   : 'E-mail confirmation',
    first_name          : 'First name',
    last_name           : 'Last name'
  },

  validateForm : function(data, el) {
    var acceptTerms = !!data.acceptTerms, validCreds, validName, validateRequired;

    if(!acceptTerms) {
      this.errors.push('Please accept the terms of service');
      $(el).find('fieldset.form-group.terms').addClass('has-error');
      acceptTerms = false; // So when we delete the acceptTerms key this is still there
    }

    validCreds       = this.validCreds(el, data.username, data.password, data.passwordConfirmation, data.email, data.emailConfirmation);
    validName        = this.validName(el, data.first_name, data.last_name);
    validateRequired = this.validateRequired(el, data);

    delete data.acceptTerms;

    return acceptTerms && validCreds && validName;
  },

  validCreds    : function(el, username, passwd, passwdConf, email, emailConf) {
    var validPassword = this.validPassword(el, passwd, passwdConf);
    var validUsername = this.validUsername(el, username);
    var validEmail    = this.validEmail(el, email, emailConf);

    if(passwd && passwd.indexOf(username) !== -1) {
      this.errors.push('Password cannot contain username');
      validPassword = false;
    }

    return validPassword && validUsername && validEmail;
  },

  validateRequired: function(el, data) {
    var that = this, valid = true;

    _.each(this.requiredFields, function(val, key) {
      if(!data[key]) {
        that.errors.push(val + ' is required');
        $(el).find('input[name=' + key + ']').addClass('has-error');
        valid = false;
      }
    });

    return valid;
  },

  validEmail       : function(el, email, confirmation) {
    var validEmail = true, validConfirmation = true;

    if(email && !email.match(/(\S+)@(\S+)\.(\S+)/)) {
      this.errors.push('Not a valid e-mail address');
      validEmail = false;
    }

    if(email && confirmation && email !== confirmation) {
      this.errors.push('E-mail and e-mail confirmation don\'t match');
      validEmail = false, validConfirmation = false;
    }

    if (!validEmail) { $(el).find('input[name=email]').addClass('has-error') }
    if (!validConfirmation) { $(el).find('input[name=emailConfirmation]').addClass('has-error') }

    return validEmail && validConfirmation;
  },

  validName    : function(el, first, last) {
    var firstValid = true, lastValid = true;

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

    if (!firstValid) { $(el).find('input[name=first_name]').addClass('has-error'); }
    if (!lastValid) { $(el).find('input[name=last_name]').addClass('has-error'); }
    return firstValid && lastValid;
  },

  validPassword: function(el, password, confirmation) {
    var validPassword = true, validConfirmation = true;

    if(password && password.length < 8) {
      this.errors.push('Password must be at least 8 characters long');
      validPassword = false, validConfirmation = false;
    }

    if(password && (!password.match(/[A-Za-z]/) || !password.match(/[0-9]/))) {
      this.errors.push('Password must contain at least 1 letter and 1 number');
      validPassword = false, validConfirmation = false;
    }

    if(password && confirmation && password !== confirmation) {
      this.errors.push('Password and password confirmation don\'t match');
      validPassword = false, validConfirmation = false;
    }

    if (!validPassword) { $(el).find('input[name=password]').addClass('has-error') }
    if (!validConfirmation) { $(el).find('input[name=passwordConfirmation]').addClass('has-error') }

    return validPassword && validConfirmation;
  },

  validUsername: function(el, name) {
    var valid = true;

    if(name && name.length < 6) {
      valid = false;
      this.errors.push('Username must be at least 6 characters long');
    }

    if(name && !name.match(/^[A-Za-z0-9_\- ]*$/)) {
      valid = false;
      this.errors.push('Username may contain only alphanumeric characters, spaces, _, and -');
    }

    if (!valid) { $el.find('input[name=username]').addClass('has-error') }
    return valid;
  },
};

function renderErrorPanel(errors, el) {
  var html = "<div id='error-panel' class='panel-panel-danger'>" + ErrorPanelTemplate({errors: errors}) + "</div>";
  $(el).prepend(html);
}

$(document).ready(function() {
  $('#registration-form').submit(function(e) {
    e.preventDefault();

    var data = getFormContents(this);

    validator.errors = [];

    if(validator.validateForm(data, this) !== true) {
      renderErrorPanel(validator.errors, this);
      return;
    }
  });
});