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

    var data = Canto.Utils.getAttributes(this.$el);
    if(!this.validateForm(data)) { return; }

    var user = new UserModel(),
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
    return true;
  },

  /* Core View Functions
  /**************************************************************************/

  render      : function() {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = RegistrationFormView;