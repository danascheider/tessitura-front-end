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

    renderSidebar: function() {
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});
      return this;
    },

    // Core View Attributes //

    tagName       : 'div',
    id            : 'dashboard-wrapper',
    className     : 'dashboard',

    events   : {
      'click'             : 'hideDropdownMenus',
      'click li.dropdown' : 'toggleDropdownMenu',
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    hideDropdownMenus: function(e) {
      var li = $('li.dropdown');

      if(!li.is(e.target) && !li.has(e.target).length) {
        li.removeClass('open');
      }
    },

    toggleDropdownMenu: function(e) {
      var li = $(e.target).closest('li');
      li.siblings().removeClass('open');
      li.toggleClass('open');
    },

    renderSidebar: function() {
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});
      return this;
    },

    // Core View Methods //

    initialize: function(opts) {
      this.user = opts.user;
    },
    
    render: function() {
      this.$el.html(this.template({user: this.user}));
      this.renderSidebar();

      // Best practices
      return this;
    }
  });

  return DashboardView;
});