define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'utils',
  'models/user',
  'views/partials/loginForm',
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
    LoginFormView,
    HomepageTemplate) {
  
  var HomepageView = Backbone.View.extend({
    events  : {
      'submit #registration-form' : 'createUser',
      'click nav li .login-link'  : 'toggleLoginForm',
      'dblclick #shade'           : 'hideLoginForm'
    },

    tagName  : 'div',
    id       : 'homepage-wrapper',
    template : _.template(HomepageTemplate),

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

          that.trigger('loginSuccess');
          Backbone.history.navigate('#dashboard', {trigger: true});
        },

        error : function(error, response) {
          console.log('Error: Model not created: ', response);
        }
      });
    },

    hideLoginForm   : function(e) {
      var t = $(e.target);
      if (t.attr('id') !== 'login-form' && this.$loginForm.$el.has(t).length === 0) {
        this.$('#shade').hide();
        this.$('div.text-vertical-center').children().show();
      }
    },

    reset           : function() {
      this.remove();
      this.initialize();
      return this;
    },

    toggleLoginForm : function() {

      // FIX: Should introduce some sort of different behavior if the user is
      //      already logged in... maybe a link to the dashboard and/or a logout link?

      if(!$.cookie('auth')) {
        this.$('div.text-vertical-center').children().toggle();
        this.$('#shade').toggle();
      }
    },

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize       : function() {
      this.$loginForm = this.$loginForm || new LoginFormView();

      this.listenTo(this.$loginForm, 'loginSuccess', function() { this.trigger('loginSuccess'); });
    },

    render           : function() {
      this.$el.html(this.template());
      this.$loginForm = this.$loginForm || new LoginFormView();
      this.$('#shade').html(this.$loginForm.render().el);
      return this;
    }
  });

  return HomepageView;
});