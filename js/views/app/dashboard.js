define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'collections/tasks',
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
    UserModel,
    TaskCollection,
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

    initialize: function() {
      this.user = new UserModel({id: $.cookie('userID')});
      this.user.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        }
      });
    },

    render: function() {
      // Enable dashboard-specific CSS properties
      $('body').attr('id', 'dashboard');

      // Render main dashboard view
      this.$el.append(this.template({user: this.user.attributes}));

      // Render sidebar
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});

      // Fetch the user's tasks and render in the task panel
      this.user.tasks = new TaskCollection();
      var that = this;

      this.user.tasks.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(collection, response, options) {
          console.log(collection)
          that.$taskPanel = new TaskPanelView({el: that.$('#task-panel'), collection: collection});
        }
      });

      // Best practices
      return this;
    }
  });

  return DashboardView;
});