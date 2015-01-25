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
      'submit #registration-form'       : 'createUser',
      'click nav li .login-link'        : 'toggleLoginForm',
      'dblclick #shade'                 : 'hideLoginForm',
      'submit #login-form'              : 'loginUser',
      'click #login-form .pull-right a' : 'loginHelp'
    },

    tagName : 'div',
    id      : 'homepage-wrapper',

    createUser      : function(e) {
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

    hideLoginForm   : function(e) {
      var t = $(e.target);
      if (t.attr('id') !== 'login-form' && this.$('#login-form').has(t).length === 0) {
        this.$('#shade').hide();
        this.$('div.text-vertical-center').children().show();
      }
    },

    loginHelp       : function() {
      console.log('Haha! You\'re boned!');
    },

    loginUser       : function(e) {
      e.preventDefault();

      var that = this, form = $(e.target), attrs = Utils.getAttributes(form);
      var hash = btoa(attrs.username + ':' + attrs.password);

      $.ajax({
        type: 'POST',
        url : API.login,
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + hash);
        },
        success: function(obj) {
          obj = JSON.parse(obj);

          if(attrs.remember === 'Remember Me') {
            $.cookie('auth', hash, {expires: 365});
            $.cookie('userID', obj.user.id, {expires: 365});
          } else {
            $.cookie('auth', hash);
            $.cookie('userID', obj.user.id);
          }

          window.user = new UserModel(obj.user, {sync: false});

          that.trigger('ajaxSuccess');
        }
      });
    },

    toggleLoginForm : function() {
      if(!$.cookie('auth')) {
        this.$('div.text-vertical-center').children().toggle();
        this.$('#shade').toggle();
      }
    },

    render : function() {
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});