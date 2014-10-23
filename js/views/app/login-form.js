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
    el     : $('body'),

    events : {
      'click button:submit': 'loginUser'
    },

    initialize: function(router) {
      this.router = router;
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

        success    : function(obj, status, xhr) {
          var obj = JSON.parse(obj)
          Extras.setCookie(username, password, obj['user']);
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