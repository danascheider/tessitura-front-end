define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'utils',
  'text!templates/app/login-form.html',
  'cookie',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!fa-styles/font-awesome.min.css'
  ], function($, _, Backbone, API, Utils, LoginFormTemplate) {

  var LoginFormView = Backbone.View.extend({
    el     : $('body'),

    events : {
      'click button:submit' : 'logInUser',
      'click .pull-right a' : 'loginHelp'
    },

    loginHelp : function(e) {
      e.preventDefault();

      // FIX: It should not alert "Haha! You're boned!" in production
      alert("Haha! You're boned!");
    },
    
    logInUser : function(e) {
      e.preventDefault();
      var that = this;
      var data = Utils.getAttributes(this.$('form'));
      var exp  = data.remember === 'Remember Me';
      var hash = btoa(data.username + ':' + data.password);

      $.ajax({
        url        : API.login,
        type       : 'POST',
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + hash);
        },

        success    : function(obj) {
          obj = JSON.parse(obj);

          if(data.remember === 'Remember Me') {
            $.cookie('auth', hash, {expires: 365});
            $.cookie('userID', obj.user.id, {expires: 365});
          } else {
            $.cookie('auth', hash);
            $.cookie('userID', obj.user.id);
          }
          
          Backbone.history.navigate('dashboard', {trigger: true});
        },

        error      : function(xhr, status, error) {
          that.$('form')[0].reset();
          console.log('Error: ', error);
        }
      });
    },  

    render : function() {
      $('body').attr('id', 'dashboard');
      this.$el.html(_.template(LoginFormTemplate));
      return this;
    }
  });

  return LoginFormView;
});