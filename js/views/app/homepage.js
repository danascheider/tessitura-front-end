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
    el: $('body'),
    render: function() {
      this.$el.html(_.template(HomepageTemplate));
    }
  });

  return HomepageView;
});