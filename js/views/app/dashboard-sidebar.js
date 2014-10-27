define(['jquery', 'underscore', 'backbone', 'text!templates/partials/dashboard-sidebar.html'],
  function($, _, Backbone, SidebarTemplate) {
  
  var DashboardSidebarView = Backbone.View.extend({
    events: {
      'click ul#side-menu li a' : 'toggleSecondLevelNav'
    },

    template: _.template(SidebarTemplate),

    toggleSecondLevelNav: function(e) {
      e.preventDefault();
      var li = $(e.target).parent('li');

      li.toggleClass('active');

      if (li.hasClass('active')) {

        // Only one li can be active at a time.

        li.siblings('li').removeClass('active');
        li.siblings('li').find('ul.nav').slideUp();
      } else {

        // When the li is no longer active, its children should not
        // be active, either.

        li.find('li.active').removeClass('active');
      }

      li.children('ul.nav').slideToggle();

      // Stop the menu from immediately sliding up again.
      e.stopPropagation();
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template);
    }
  });

  return DashboardSidebarView;
});