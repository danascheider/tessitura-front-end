define([
  'jquery', 
  'underscore', 
  'backbone', 
  'text!templates/partials/dashboard-sidebar.html'
], function($, _, Backbone, SidebarTemplate) {
  
  var DashboardSidebarView = Backbone.View.extend({
    template  : _.template(SidebarTemplate),

    tagName   : 'ul',
    className : 'nav',
    id        : 'side-menu',

    events    : {
      'click a.sidebar-link'       : 'toggleSecondLevelNav',
      'click li > .dashboard-link' : 'goToDashboard',
      'click li > .task-page-link' : 'goToTaskPage'
    },

    // For testing purposes - location.hash can't be stubbed
    // directly, so this has to be called in the methods that 
    // require the information.

    getLocationHash      : function() {
      return location.hash;
    },

    goToDashboard        : function() {
      if(this.getLocationHash() !== '#dashboard') {
        Backbone.history.navigate('dashboard', {trigger: true});
      }
    },

    goToTaskPage         : function() {
      if(this.getLocationHash() !== '#tasks') {
        Backbone.history.navigate('tasks', {trigger: true});
      }
    },

    toggleSecondLevelNav : function(e) {
      var li = $(e.target).closest('li');

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
    },

    render: function() {
      this.$el.html(this.template);
      return this;
    }
  });

  return DashboardSidebarView;
});