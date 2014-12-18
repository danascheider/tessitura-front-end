define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'utils',
  'models/user',
  'text!templates/app/homepage.html',
  'css!stylesheets/bootstrap.css',
  'css!fa-styles/font-awesome.min.css',
  'css!stylesheets/homepage.css',
  'css!stylesheets/canto.css'], function(
    $, 
    _, 
    Backbone, 
    Cookie,
    API,
    Utils,
    UserModel,
    HomepageTemplate){
  
  var HomepageView = Backbone.View.extend({
    events  : {
      'dblclick #shade'           : 'hideLoginForm',
      'submit #registration-form' : 'createUser',
      'click nav li .login-link'  : 'toggleLoginForm'
    },

    tagName : 'div',
    id      : 'homepage-wrapper',

    createUser   : function(e) {
      e.preventDefault();

      var that = this;
      var form = $(e.target);
      var attrs = Utils.getAttributes(form);
      var hash = btoa(attrs.username + ':' + attrs.password);

      var newUser = new UserModel(attrs);

      newUser.save(newUser.attrs, {
        url     : API.users.collection,
        type    : 'POST',
        success : function(model) {
          $.cookie('userID', model.id);
          $.cookie('auth', hash);

          that.trigger('ajaxSuccess');
          
          // FIX: Is this statement, and others like it, really needed
          //      given that the router listens to events triggered on
          //      the presenters?

          Backbone.history.navigate('#dashboard', {trigger: true});
        },

        error : function(error, response) {
          console.log('Error: Model not created: ', response);
        }
      });
    },

    hideLoginForm : function(e) {
      var t = $(e.target);
      if (t.attr('id') !== 'login-form' && this.$('#login-form').has(t).length === 0) {
        this.$('#shade').hide();
        this.$('div.text-vertical-center').children().show();
      }
    },

    toggleLoginForm : function(e) {
      this.$('div.text-vertical-center').children().toggle();
      this.$('#shade').toggle();
    },

    render : function() {
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});