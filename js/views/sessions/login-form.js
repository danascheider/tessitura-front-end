define([
  'jquery',
  'underscore',
  'backbone',
  'extras',
  'text!templates/sessions/login-form.html'
  ], function($, _, Backbone, Extras, LoginForm) {

  LoginFormView = Backbone.View.extend({
    el     : $('#wrapper'),
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
    }

    render : function() {
      var data = {};
      var compiledTemplate = _.template(LoginForm);
      this.$el.html(compiledTemplate, data);
    }
  });

  return LoginFormView;
});