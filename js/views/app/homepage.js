define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/homepage.html',
  'css!stylesheets/homepage.css'], function($, _, Backbone, HomepageTemplate, Stylesheet){
  
  HomepageView = Backbone.View.extend({
    el: $('body'),
    render: function() {
      this.$el.html(_.template(HomepageTemplate));
    }
  });

  return HomepageView;
});