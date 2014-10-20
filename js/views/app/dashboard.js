define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/dashboard.html',
  ], function($, _, Backbone, DashboardTemplate) {
  
  var DashboardView = Backbone.View.extend({
    el: $('#wrapper')
  })
});