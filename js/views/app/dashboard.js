define([
  'jquery',
  'underscore',
  'backbone',
  'views/app/dashboard-sidebar',
  'views/tasks/task-panel',
  'text!templates/app/dashboard.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _, 
    Backbone, 
    SidebarView,
    TaskPanelView,
    DashboardTemplate, 
    BootstrapStyles, 
    DashStyles, 
    CantoStyles, 
    FAStyles) {
  
  var DashboardView = Backbone.View.extend({

    // Core View Attributes //

    el       : $('body'),

    events   : {
      'click body'                : 'hideDropdownMenus',
      'click navbar-top-links a'  : 'toggleDropdownMenu',
      'click a.dropdown-toggle'   : 'blurParentLi',
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    blurParentLi: function() {
      if($(this).parent('li').is(':visible')) {
        $(this).parent('li').blur();
      }
    },

    hideDropdownMenus: function(e) {
      var menu = $('.dropdown-menu');
      if(!menu.is(e.target) && menu.has(e.target).length === 0) {
        menu.hide();
      }
    },

    toggleDropdownMenu: function(e) {
      $.each($(this).parent('li').siblings(), function() {
        if ($(this).find('.dropdown-menu').is(':visible')) {
          $(this).find('.dropdown-menu').hide();
        }
      });
      $(this).parent('li').find('.dropdown-menu').toggle();
    },

    // Core View Methods //

    initialize: function(options) {
      this.options = options || {};
    },

    render: function() {
      // Enable dashboard-linked CSS properties
      $('body').attr('id', 'dashboard');

      // Render main dashboard view
      this.$el.append(this.template({user: this.options.user}));

      // Render sidebar
      var sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});
      sidebar.render();

      // Render task panel widget view
      var taskPanel = new TaskPanelView({el: this.$('#task-panel')});
      taskPanel.render();

      // Best practices
      return this;
    }
  });

  return DashboardView;
});