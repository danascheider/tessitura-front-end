define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/homepage.html',
  'css!stylesheets/bootstrap.css',
  'css!fa-styles/font-awesome.min.css',
  'css!stylesheets/homepage.css'], function(
    $, 
    _, 
    Backbone, 
    HomepageTemplate, 
    BootstrapStyles, 
    FAStyles,
    HomepageStyles){
  
  HomepageView = Backbone.View.extend({
    initialize: function(router) {
      this.router = router;
    },

    el     : $('body'),

    events : {
      'click .login-link' : 'getLogin'
    },

    getLogin : function(e) {
      e.preventDefault();
      this.router.displayLogin();
      Backbone.history.navigate('login');
    },

    render : function() {
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});