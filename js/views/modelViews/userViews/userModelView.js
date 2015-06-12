var UserModelView = Tessitura.View.extend({

  /* Static Properties
  /**************************************************************************************/

  className    : 'user-model',

  /* Tessitura View Properties
  /**************************************************************************************/

  klass        : 'UserModelView',
  family       : 'Tessitura.View',
  superFamily  : 'Backbone.View',
  types        : function() {
    return Tessitura.View.prototype.types().concat(this.klass, 'UserView', 'ModelView');
  },

  /* Event Callbacks
  /**************************************************************************************/

  renderOnSync : function() {
    this.render();
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize   : function() {
    this.listenTo(this.model, 'sync', this.renderOnSync);
  }
});

module.exports = UserModelView;