Tessitura.UserModelView = Tessitura.View.extend({

  /* Static Properties
  /**************************************************************************************/

  className    : 'user-model',
  template     : JST['users/model'],
  events       : {
    'dblclick span.p' : 'displayForm',
    'keydown input'   : 'triageKeypress',
    'keydown select'  : 'triageKeypress',
    'submit form'     : 'submitUpdate'
  },

  /* Event Callbacks
  /**************************************************************************************/

  // The displayForm function can be used as an event callback or as a normal function. 
  // When used as an event callback, it takes an event object as its argument and deduces
  // the input to display based on the `target` property of the `jQuery.Event` object.
  // Otherwise, its argument is presumed to be a jQuery object of the '.profile-field'
  // span containing the input to be displayed.

  displayForm    : function(arg) {
    var span = arg.target ? ($(arg.target).attr('class') && $(arg.target).attr('class').match(/profile-field/) ? $(arg.target) : /* istanbul ignore next */ $(arg.target).closest('.profile-field')) : $(arg);

    // Hide the text of the user's profile information and show the input
    span.find('.p').hide();
    span.find('.form').show();

    // If the input being shown is the first- or last-name input, resize it to match
    // the length of the user's current name. This prevents excessive resizing of the
    // surrounding elements.
    
    this.resizeInputs(span);

    // Focus on the input that has just been displayed and select the text inside

    span.find('form > input, form > select').focus().select();
  },

  handleTab      : function(e) {
    e.preventDefault();

    // If the current field is first_name, the next field is last_name. Otherwise, it's
    // the .profile-field element in the next row in the table.

    var attr                        = $(e.target).attr('name');
    var currentValue                = encodeURIComponent($(e.target)[0].value);
    var nextField                   = $(e.target).closest('.profile-field').attr('id') === 'first_name' ? /* istanbul ignore next */ this.$('#last_name') : $(e.target).closest('tr').next().find('td > span.profile-field');
    var theAttributeValueHasChanged = this.model.get(attr) !== currentValue;
    var theFieldIsBlank             = !currentValue || currentValue === '';
    var theFieldCanBeBlank          = ['username', 'password', 'email', 'first_name', 'last_name'].indexOf(attr) === -1;

    if(theAttributeValueHasChanged && !(theFieldIsBlank && theFieldCanBeBlank)) {
      $(e.target).closest('form').submit();
    }

    this.hideInputs();
    this.displayForm(nextField);  
  },

  // The `submitUpdate` function updates the user's profile with whatever the
  // user has entered into the input. It automatically adds the authorization 
  // header to the request and, if the request is successful, hides the input.

  submitUpdate   : function(e) {
    e.preventDefault();

    var data = {}, that = this;
    var data = Tessitura.Utils.getAttributes($(e.target));

    this.model.save(data, {
      beforeSend:  /* istanbul ignore next */ function(xhr) {
        /* istanbul ignore next */ xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      },
      error  : /* istanbul ignore next */ function(model, response, options) {
        /* istanbul ignore next */ console.log('Model: ', model);
        /* istanbul ignore next */ console.log('Response: ', response);
        /* istanbul ignore next */ console.log('Options: ', options);
      },
      success: function(model) {
        if(data['username'] || data['password']) {
          var cookies = $.cookie();

          var oldAuthCookie = $.cookie('auth');

          for(var cookie in cookies) {
            $.removeCookie(cookie);
          }

          var password = data.password || atob(oldAuthCookie).split(':')[1];

          $.cookie('auth', btoa(model.get('username') + ':' + password));
          $.cookie('userID', model.get('id'));
        }

        $(e.target).closest('span.form').hide();
      },
    });
  },

  triageKeypress : function(e) {
    var theKeyWasEnter = e.keyCode === 13;
    var theKeyWasTab   = e.keyCode === 9;
    var theKeyWasEsc   = e.keyCode === 27;
    var attr           = $(e.target).attr('name');
    var currentValue   = encodeURIComponent($(e.target)[0].value);

    if(theKeyWasEnter) { 
      e.preventDefault();
      var attributeValueChanged = this.model.get(attr) !== currentValue;
      var theFieldIsBlank       = currentValue === ''
      var theFieldCanBeBlank    = ['username', 'email', 'password', 'first_name', 'last_name'].indexOf(attr) === -1
      
      this.hideInputs(); 

      if(attributeValueChanged && !(theFieldIsBlank && theFieldCanBeBlank)) {
        $(e.target).closest('form').submit();
      }
    }

    if(theKeyWasTab) {
      this.handleTab(e);
    }

    if(theKeyWasEsc) {
      this.hideInputs();
    }
  },

  updateDisplay  : function() {
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
    this.$('span.form').hide();
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