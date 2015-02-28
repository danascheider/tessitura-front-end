define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'api',
  'utils',
  'text!templates/partials/login-form.html',
  'cookie'
], function($, _, Backbone, UserModel, API, Utils, LoginFormTemplate) {

  var LoginFormView = Backbone.View.extend({
    template : _.template(LoginFormTemplate),
    tagName  : 'form',
    id       : 'login-form',

    events   : {
      'submit'              : 'loginUser',
      'click .pull-right a' : 'loginHelp'
    },

    loginHelp       : function() {
      console.log('Haha you\'re boned!');
    },

    loginUser       : function(e) {
      e.preventDefault();

      var that = this, attrs = Utils.getAttributes(this.$el);
      var hash = btoa(attrs.username + ':' + attrs.password);

      $.ajax({
        type: 'POST',
        url : API.login,
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + hash);
        },
        success: function(obj) {
          if(attrs.remember === 'Remember Me') {
            $.cookie('auth', hash, {expires: 365});
            $.cookie('userID', obj.user.id, {expires: 365});
          } else {
            $.cookie('auth', hash);
            $.cookie('userID', obj.user.id);
          }

          that.trigger('loginSuccess');
        }
      });
    },

    render   : function() {
      this.$el.html(this.template());
      return this;
    },

    reset    : function() {
      this.remove();
      this.initialize();
      return this;
    }
  });

  return LoginFormView;
});