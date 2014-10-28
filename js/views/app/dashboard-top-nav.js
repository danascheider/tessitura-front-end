define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/dashboard-top-nav.html',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/font-awesome.css'
], function($, _, Backbone, TopNavTemplate, DashStyles, FAStyles) {

  var DashboardTopNavView = Backbone.View.extend({
    tagName: 'nav',

    template: _.template(TopNavTemplate),

    events: {
      'click .navbar-top-links a' : 'toggleDropdownMenu',
    },

    toggleDropdownMenu: function(e) {
      e.preventDefault();
      var target = e.target;

      $.each($(target).parent('li').siblings(), function() {
        $(this).removeClass('open');
      });

      $(target).parent('li').toggleClass('open');
    },
    
    initialize: function() {
      _.extend(this, Backbone.Events);
      this.render();
    },

    render: function() {
      this.$el.append(this.template(this.model));
    }
  });

  return DashboardTopNavView;
});