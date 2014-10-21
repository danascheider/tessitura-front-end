define([
  'jquery',
  'underscore',
  'backbone',
  'extras',
  'text!templates/app/login-form.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/sb-admin.css',
  'css!fa-styles/font-awesome.min.css'
  ], function($, _, Backbone, Extras, LoginForm, BootstrapStyles, ThemeStyles, FAStyles) {

  LoginFormView = Backbone.View.extend({
    el     : $('body'),
    events : {
      'click button:submit': 'loginUser'
    },

    loginUser: function() {
      var data = Extras.getAttributes(this);
      var username = data['username'];
      var password = data['password'];

      $.ajax({
        url        : 'http://localhost:9292/login',
        type       : 'POST',
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', Extras.makeBasicAuth(username, password));
        },
        success    : function(data, status, xhr) {
          // Create and store a new session
        }
      });
    },  

    render : function() {
      this.$el.html(_.template(LoginForm));
      return this;
    }
  });

  return LoginFormView;
});