Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var UserModel = require('../../models/userModel.js');

var RegistrationFormView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/regForm'],
  tagName     : 'form',
  id          : 'registration-form',

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

    var user = new UserModel();
    this.trigger('userCreated');
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = RegistrationFormView;