define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'form-utils',
  'text!templates/app/login-form.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!fa-styles/font-awesome.min.css'
  ], function($, _, Backbone, Cookie, FormUtils, LoginForm, BootstrapStyles, DashStyles, FAStyles) {

  LoginFormView = Backbone.View.extend({
    el     : $('body'),

    events : {
      'click button:submit': 'logInUser'
    },
    
    logInUser: function(e) {
      e.preventDefault();
      var that = this
      var data = FormUtils.getAttributes(this.$el.find('form'));
      var hash = btoa(data['username'] + ':' + data['password']);

      $.ajax({
        url        : 'http://localhost:9292/login',
        type       : 'POST',
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic: ' + hash);
        },

        success    : function(obj, status, xhr) {
          var obj = JSON.parse(obj)
          $.cookie('auth', hash);
          $.cookie('userID', obj['user']['id']);
          Backbone.history.navigate('dashboard', {trigger: true});
        },

        error      : function(xhr, status, error) {
          that.$el.find('form').reset();
          console.log('Error: ', error);
        }
      });
    },  

    render : function() {
      $('body').attr('id', 'dashboard');
      this.$el.html(_.template(LoginForm));
      return this;
    }
  });

  return LoginFormView;
});