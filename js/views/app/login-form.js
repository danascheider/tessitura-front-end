define([
  'jquery',
  'underscore',
  'backbone',
  'extras',
  'cookie',
  'text!templates/app/login-form.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/sb-admin.css',
  'css!fa-styles/font-awesome.min.css'
  ], function($, _, Backbone, Extras, Cookie, LoginForm, BootstrapStyles, ThemeStyles, FAStyles) {

  LoginFormView = Backbone.View.extend({
    initialize: function(router) {
      this.router = router;
    },

    el     : $('body'),
    events : {
      'click button:submit': 'loginUser'
    },

    loginUser: function(e) {
      e.preventDefault();
      var that = this
      var data = Extras.getAttributes(this.$el.find('form'));
      var username = data['username'];
      var password = data['password'];

      $.ajax({
        url        : 'http://localhost:9292/login',
        type       : 'POST',
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', Extras.makeBasicAuth(username, password));
        },
        success    : function(data, status, xhr) {
          $.cookie('username', data['username']);
          $.cookie('password', data['password']);
          $.cookie('userID', data['id']);
          console.log('Success');
          that.router.navigate('dashboard');
        },
        error      : function(xhr, status, error) {
          that.$el.find('form').clear();
          console.log('Error: ', error);
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