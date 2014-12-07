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
  'css!stylesheets/homepage.css'], function(
    $, 
    _, 
    Backbone, 
    Cookie,
    API,
    Utils,
    UserModel,
    HomepageTemplate){
  
  var HomepageView = Backbone.View.extend({
    initialize: function(router) {
      this.router = this.router || router;
    },

    events : {
      'submit #registration-form' : 'createUser'
    },

    el     : $('body'),

    createUser : function(e) {
      e.preventDefault();
      var form = $(e.target);
      var that = this;
      var attrs = Utils.getAttributes(form);
      var hash = btoa(attrs['username'] + ':' + attrs['password']);

      var newUser = new UserModel(attrs);

      newUser.save(newUser.attrs, {
        url     : API.users.collection,
        type    : 'POST',
        success : function(model, response, xhr) {
          $.cookie('userID', model['id']);
          $.cookie('auth', hash);
          Backbone.history.navigate('#dashboard', {trigger: true});
        },

        error : function(error, response, xhr) {
          console.log('Error: Model not created: ', response);
        }
      })
    },

    render : function() {
      $('body').attr('id', 'homepage');
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});