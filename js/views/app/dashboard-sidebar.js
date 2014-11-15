define(['jquery', 'underscore', 'backbone', 'text!templates/partials/dashboard-sidebar.html'],
  function($, _, Backbone, SidebarTemplate) {
  
  var DashboardSidebarView = Backbone.View.extend({
    template : _.template(SidebarTemplate),
    events   : {
      'click ul#side-menu li a'     : 'toggleSecondLevelNav',
      'click li > a.dashboard-link' : 'goToDashboard',
      'click li > a.task-page-link' : 'goToTaskPage'
    },

    goToDashboard        : function(e) {
      e.preventDefault();
      if(location.hash != '#dashboard') {
        Backbone.history.navigate('dashboard', {trigger: true});
      }
    },

    goToDashboard        : function(e) {
      e.preventDefault();
      if(location.hash != '#tasks') {
        Backbone.history.navigate('tasks', {trigger: true});
      }
    }

    toggleSecondLevelNav : function(e) {
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
      return this;
    }
  });

  return DashboardSidebarView;
});