define([
  'jquery',
  'underscore',
  'backbone',
  'api',
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
    API,
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
      'click #wrapper'          : 'hideDropdownMenus',
      'click a.dropdown-toggle' : 'toggleDropdownMenu'
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    hideDropdownMenus: function(e) {
      var li = $('li.dropdown');
      if(!li.is(e.target) && li.has(e.target).length === 0) {
        li.removeClass('open');
      }
    },

    toggleDropdownMenu: function(e) {
      e.preventDefault();
      var target = e.target;

      $.each($(target).parent('li').siblings(), function() {
        $(this).removeClass('open');
      });

      $(target).parent('li').toggleClass('open');
    },

    // Core View Methods //

    initialize: function() {
      this.user = new UserModel({id: $.cookie('userID')});
      this.user.fetch({
        async      : false,
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        }
      });

      _.extend(this, Backbone.Events);
    },

    render: function() {
      // Enable dashboard-specific CSS properties
      $('body').attr('id', 'dashboard');

      // Render main dashboard view
      this.$el.html(this.template(this.user.attributes));

      // Render sidebar
      this.$sidebar = new SidebarView({el: this.$('div.sidebar-collapse')});

      // Fetch the user's tasks and render in the task panel
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