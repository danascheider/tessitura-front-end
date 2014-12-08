define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'models/user',
  'views/app/dashboard-sidebar',
  'views/app/dashboard-home',
  'views/app/kanban-board',
  'text!templates/app/dashboard.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
], function(
    $, _, 
    Backbone, 
    API,
    UserModel,
    SidebarView,
    HomeView,
    KanbanBoardView,
    DashboardTemplate) {
  
  var DashboardView = Backbone.View.extend({

    renderSidebar: function() {
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});
      return this;
    },

    // Core View Attributes //

    el       : $('body'),

    events   : {
      'click #wrapper'    : 'hideDropdownMenus',
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
      this.opts = opts || {};
      this.user = new UserModel({id: $.cookie('userID')});

      // Create child views
      this.$kanbanBoardView = new KanbanBoardView({user: this.user});
      this.$homeView = new HomeView({user: this.user});
    },

    render: function() {
      // Render main dashboard view, add ID to body for CSS reasons
      this.$el.html(this.template({user: this.user}));
      this.$el.attr('id', 'dashboard');

      this.renderSidebar();

      // Best practices
      return this;
    }
  });

  return DashboardView;
});