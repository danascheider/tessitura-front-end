Canto = Canto || require('../dependencies.js');

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

  emitRedirect   : function(opts) {
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

    var that = this;
  },

  /* Core Model Functions
  /***************************************************************************************/

  initialize : function() {
    this.homepageView = new Canto.HomepageView();

    this.listenTo(this.homepageView, 'redirect', this.emitRedirect);
  }
});

module.exports = AppPresenter;