Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var RegistrationFormView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'RegistrationFormView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['RegistrationFormView', 'RegistrationForm', 'FormView', 'PartialView']);
  }
});

module.exports = RegistrationFormView;