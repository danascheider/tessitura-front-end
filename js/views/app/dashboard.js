define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'models/user',
  'collections/tasks',
  'views/app/dashboard-sidebar',
  'views/app/dashboard-top-nav',
  'views/tasks/task-panel',
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
    TaskCollection,
    SidebarView,
    TopNavView,
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
      'click #wrapper'            : 'hideDropdownMenus',
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    hideDropdownMenus: function(e) {
      var li = $('li.dropdown');
      if(!li.is(e.target) && li.has(e.target).length === 0) {
        li.removeClass('open');
      }
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
      this.$el.html(this.template());

      // Render top navbar
      this.$topNav = new TopNavView({model: this.user.attributes, el: this.$('nav.navbar-fixed-top')});

      // Render sidebar
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});

      // Fetch the user's tasks and render in the task panel
      this.user.tasks = new TaskCollection();
      var that = this;

      this.user.tasks.fetch({
        url: API.tasks.collection(this.user.id),
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(collection, response, options) {
          that.$taskPanel = new TaskPanelView({el: that.$('#task-panel'), collection: collection});
        }
      });

      // Best practices
      return this;
    }
  });

  return DashboardView;
});