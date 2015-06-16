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
    'dblclick span.p' : 'displayInput',
    'keypress input'  : 'triageKeypress'
  },

  /* Event Callbacks
  /**************************************************************************************/

  displayInput : function(e) {
    this.$('.input').hide();
    this.$('.p').show();
    span = ($(e.target)[0] && $(e.target)[0].className.match(/profile-field/)) ? $(e.target) : $(e.target).closest('span.profile-field');
    span.find('.p').hide();
    span.find('.input').show();
    span.find('input').focus().select();
  },

  renderOnSync : function() {
    this.render();
  },

  submitUpdate : function(e) {
    e.preventDefault();

    var data = {};
    data[$(e.target).attr('name')] = $(e.target)[0].value;

    this.model.save(data, {
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      },
      error  : function(model, response, options) {
        console.log(response);
      },
      success: function() {
        $(e.target).closest('span.input').hide();
      },
    });
  },

  triageKeypress: function(e) {
    var theKeyWasEnter = e.keyCode === 13;
    var attr           = $(e.target).attr('name');
    var value          = $(e.target)[0].value;

    if(theKeyWasEnter) { 
      this.hideInputs(); 

      if(value !== this.model.get(attr) && value !== '') {
        this.submitUpdate(e);
      }
    }
  },

  /* Special Functions
  /**************************************************************************************/

  hideInputs   : function() {
    this.$('span.input').hide();
    this.$('span.p').show();
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