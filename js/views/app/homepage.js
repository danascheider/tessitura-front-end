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

    render : function() {
      $('body').attrs('id', 'homepage');
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});