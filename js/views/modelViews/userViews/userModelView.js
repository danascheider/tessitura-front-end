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
    'keydown input'   : 'triageKeypress'
  },

  /* Event Callbacks
  /**************************************************************************************/

  // The displayInput function can be used as an event callback or as a normal function. 
  // When used as an event callback, it takes an event object as its argument and deduces
  // the input to display based on the `target` property of the `jQuery.Event` object.
  // Otherwise, its argument is presumed to be a jQuery object of the '.profile-field'
  // span containing the input to be displayed.

  displayInput : function(arg) {
    var span = arg.target ? (($(arg.target).attr('class') && $(arg.target).attr('class').match(/profile-field/)) ? $(arg.target) : $(arg.target).closest('span.profile-field')) : arg;

    // Hide the text of the user's profile information and show the input

    span.find('.p').hide();
    span.find('.input').show();

    this.resizeInputs(span);

    // Focus on the input that has just been displayed and select the text inside

    span.find('input').focus().select();
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
    var theKeyWasTab   = e.keyCode === 9;
    var attr           = $(e.target).attr('name');
    var value          = $(e.target)[0].value;

    if(theKeyWasEnter) { 
      this.hideInputs(); 

      if(value !== this.model.get(attr) && value !== '') {
        this.submitUpdate(e);
      }
    }

    if(theKeyWasTab) {
      e.preventDefault();

      var nextField = $(e.target).closest('tr').next().find('td > span.profile-field');
      nextField = $(e.target).closest('.profile-field').attr('id') === 'first_name' ? this.$('#last_name') : nextField;

      if(value === this.model.get(attr) || value === '') {
        this.hideInputs();
      }

      if(value === this.model.get(attr) || value === '') {
        this.hideInputs();
      }

      this.displayInput(nextField);
    }
  },

  /* Special Functions
  /**************************************************************************************/

  hideInputs   : function() {
    this.$('span.input').hide();
    this.$('span.p').show();
  },

  resizeInputs : function(span) {

    // If the span has ID #first_name or #last_name, the input will need to be resized
    // so as not to disrupt the layout excessively. Here we assign the variable `width`
    // to the same width as the currently-visible span with the text of the user's first
    // or last name.

    if(['first_name', 'last_name'].indexOf(span.attr('id')) > -1) {
      var width = parseInt(span.find('.p').css('width').match(/\d*/)[0]) + 10;
      span.find('input').css('width', width + 'px');
    }
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize   : function() {
    this.listenTo(this.model, 'sync', this.render);
  },

  render       : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(that, that.template({model: that.model}));
  }
});

module.exports = UserModelView;