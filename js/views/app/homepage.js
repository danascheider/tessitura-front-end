define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/homepage.html'], function($, _, Backbone, HomepageTemplate){
  
  HomepageView = Backbone.View.extend({
    el: $('body'),
    render: function() {
      this.$el.html(_.template(HomepageTemplate));
    }
  });

  return HomepageView;
});