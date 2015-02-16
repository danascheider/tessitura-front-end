define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/app/dashboard-sidebar',
  'text!templates/app/dashboard.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css',
  'cookie'
], function(
    $, _, 
    Backbone, 
    UserModel,
    SidebarView,
    DashboardTemplate) {
  
  var DashboardView = Backbone.View.extend({

    // Core View Attributes //

    tagName       : 'div',
    id            : 'dashboard-wrapper',
    
    events   : {
      'click'             : 'hideDropdownMenus',
      'click li.dropdown' : 'toggleDropdownMenu',
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    hideDropdownMenus: function(e) {
      var li = this.$('li.dropdown');

      if(!li.is(e.target) && !li.has(e.target).length) {
        li.removeClass('open');
      }
    },

    // When the user clicks one of the icons on the top nav, the following
    // things happen:
    //   1) All open dropdowns close
    //   2) If the li that was clicked was open, it closes
    //   3) If the li that was clicked was closed, it opens

    toggleDropdownMenu: function(e) {
      var li = $(e.target).closest('li');
      li.siblings().removeClass('open');
      li.toggleClass('open');
    },

    // ----------------- //
    // Core View Methods //
    // ----------------- //

    initialize: function(opts) {
      opts = opts || {};
      this.user = opts.user;
      this.$sidebar = this.$sidebar || new SidebarView();
    },
    
    render: function() {
      var that = this;
      this.$el.html(this.template({user: this.user}));
      this.$('div.sidebar-collapse').html(this.$sidebar.render().el);
      this.$sidebar.delegateEvents();
      return this;
    },

    reset: function() {
      var user = this.user;

      // Remove the view from the DOM
      this.remove();

      // Call initialize again
      this.initialize({user: user});
      return this;
    }
  });

  return DashboardView;
});