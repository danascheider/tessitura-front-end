var UserModelView = Tessitura.View.extend({

  /* Static Properties
  /**************************************************************************************/

  className    : 'user-model',
  template     : JST['users/model'],

  /* Tessitura View Properties
  /**************************************************************************************/

  klass        : 'UserModelView',
  family       : 'Tessitura.View',
  superFamily  : 'Backbone.View',
  types        : function() {
    return Tessitura.View.prototype.types().concat(this.klass, 'UserView', 'ModelView');
  },

  events       : {
    'dblclick td' : 'displayInput'
  },

  /* Event Callbacks
  /**************************************************************************************/

  displayInput : function(e) {
    this.$('.input').hide();
    this.$('.p').show();
    td = $(e.target).tagName === 'TD' ? $(e.target) : $(e.target).closest('td');
    td.find('.input').show();
    td.find('.p').hide();
  },

  renderOnSync : function() {
    this.render();
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize   : function() {
    this.listenTo(this.model, 'sync', this.renderOnSync);
  },

  render       : function() {
    var that = this;
    this.$el.html(this.template({model: that.model}));
    return this;
  }
});

module.exports = UserModelView;