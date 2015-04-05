/* Core Requires
/*****************************************************************************************/

Canto       = Canto || require('../dependencies.js');
Canto.Model = Canto.Model || require('../models/cantoModel.js');

/* Module-Specific Requires
/*****************************************************************************************/

var HomepageView = require('../views/appViews/homepageView.js');

/*****************************************************************************************
/* APP PRESENTER                                                                         *
/*****************************************************************************************/

var AppPresenter = Canto.Model.extend({

  /* Canto Model Properties
  /***************************************************************************************/

  klass : 'AppPresenter',

  types : function() {
    return Canto.Model.prototype.types().concat(['AppPresenter', 'Presenter']);
  },

  isAn  : function(type) {
    return this.isA(type);
  },

  /* Event Callbacks
  /***************************************************************************************/

  redirect   : function(opts) {
    this.trigger('redirect', opts);
  },

  /* Special Functions
  /***************************************************************************************/

  getHomepage : function() {
    this.homepageView.render();
    if(!this.homepageView.$el.is(':visible')) { $('body').html(this.homepageView.$el); }
  },

  removeAll   : function() {
    this.homepageView.remove();
  },

  /* Core Model Functions
  /***************************************************************************************/

  initialize : function() {
    this.homepageView = new HomepageView();
  }
});

module.exports = AppPresenter;