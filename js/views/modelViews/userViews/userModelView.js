Tessitura.UserModelView = Tessitura.View.extend({

  /* Static Properties
  /**************************************************************************************/

  className    : 'user-model',
  template     : JST['users/model'],
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
    var span = arg.target ? ($(arg.target).attr('class') && $(arg.target).attr('class').match(/profile-field/) ? $(arg.target) : $(arg.target).closest('.profile-field')) : $(arg);

    // Hide the text of the user's profile information and show the input
    span.find('.p').hide();
    span.find('.input').show();

    // If the input being shown is the first- or last-name input, resize it to match
    // the length of the user's current name. This prevents excessive resizing of the
    // surrounding elements.
    
    this.resizeInputs(span);

    // Focus on the input that has just been displayed and select the text inside

    span.find('input').focus().select();
  },

  // The `submitUpdate` function updates the user's profile with whatever the
  // user has entered into the input. It automatically adds the authorization 
  // header to the request and, if the request is successful, hides the input.

  submitUpdate : function(e) {
    var data = {}, that = this;
    data[$(e.target).attr('name')] = $(e.target)[0].value;
    
    this.model.save(data, {
      beforeSend:  /* istanbul ignore next */ function(xhr) {
        /* istanbul ignore next */ xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      },
      error  : /* istanbul ignore next */ function(model, response) {
        /* istanbul ignore next */ console.log(response);
      },
      success: function(model) {
        if(data['username']) {
          var token = btoa(model.get('username') + ':' + model.get('password'));
          $.removeCookie('auth');
          $.cookie('auth', token, {expires: 365});
        }

        $(e.target).closest('span.input').hide();
      },
    });
  },

  triageKeypress: function(e) {
    var theKeyWasEnter = e.keyCode === 13;
    var theKeyWasTab   = e.keyCode === 9;
    var theKeyWasEsc   = e.keyCode === 27;
    var attr           = $(e.target).attr('name');
    var currentValue   = $(e.target)[0].value;

    if(theKeyWasEnter) { 
      this.hideInputs(); 

      if(currentValue !== this.model.get(attr) && currentValue !== '') {
        this.submitUpdate(e);
      }
    }

    if(theKeyWasTab) {
      e.preventDefault();

      // If the current field is first_name, the next field is last_name. Otherwise, it's
      // the .profile-field element in the next row in the table.

      var nextField = $(e.target).closest('.profile-field').attr('id') === 'first_name' ? /* istanbul ignore next */ this.$('#last_name') : $(e.target).closest('tr').next().find('td > span.profile-field');

      if(this.model.get(attr) !== currentValue && currentValue !== '') {
        this.submitUpdate(e);
      }

      this.hideInputs();
      this.displayInput(nextField);
    }

    if(theKeyWasEsc) {
      this.hideInputs();
    }
  },

  updateDisplay: function() {
    var that = this;

    this.$('.profile-field').each(function(num, el) {
      var property = $(el).attr('id'), newValue = that.model.get(property);

      $(el).find('.p').html(newValue || 'N/A');
      $(el).find('input').attr('value', newValue);
    });
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
    this.listenTo(this.model, 'change', this.updateDisplay);
  },

  render       : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(that, that.template({model: that.model}));
  }
});

module.exports = Tessitura.UserModelView;