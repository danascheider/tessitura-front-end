Tessitura.AppPresenter = Tessitura.Model.extend({

  /* Tessitura Model Properties
  /***************************************************************************************/

  klass : 'AppPresenter',

  types : function() {
    return Tessitura.Model.prototype.types().concat(['AppPresenter', 'Presenter']);
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
    this.homepageView = new Tessitura.HomepageView();

    this.listenTo(this.homepageView, 'redirect', this.emitRedirect);
    this.listenTo(this.homepageView, 'top', this.scrollToTop);
  }
});

module.exports = Tessitura.AppPresenter;