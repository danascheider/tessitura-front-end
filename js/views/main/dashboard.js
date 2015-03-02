define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/partials/dashboardSidebar',
  'views/partials/dashboardHome',
  'views/partials/kanbanBoard',
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
    HomeView,
    TaskView,
    DashboardTemplate) {
  
  var DashboardView = Backbone.View.extend({

    // -------------------- //
    // Core View Attributes //
    // -------------------- //

    tagName       : 'div',
    id            : 'dashboard-wrapper',
    
    events   : {
      'click'             : 'hideDropdownMenus',
      'click li.dropdown' : 'toggleDropdownMenu',
    },

    template : _.template(DashboardTemplate),

    // --------------- //
    // Event Callbacks // 
    // --------------- //

    hideDropdownMenus: function(e) {
      var li = this.$('li.dropdown');

      if(!li.is(e.target) && !li.has(e.target).length) {
        li.removeClass('open');
      }
    },

    redirect          : function(e) {
      this.trigger('redirect', {destination: e.destination});
    },

    setUser           : function(user) {
      this.user = user;
      this.$homeView.setUser(user);
      this.$taskView.setUser(user);
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

    // --------------- //
    // Other Functions //
    // --------------- //

    showHomeView: function() {
      if(!this.$el.is(':visible')) { this.render(); }

      this.$taskView.remove();
      this.$homeView.render();
      this.$('nav').after(this.$homeView.el);
    },

    showTaskView: function() {
      if(!this.$el.is(':visible')) { this.render(); }

      this.$homeView.remove();
      this.$taskView.render();
      this.$('nav').after(this.$taskView.el);
    },

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize: function(opts) {
      opts = opts || {};

      this.$sidebar = new SidebarView();
      this.$homeView = new HomeView();
      this.$taskView = new TaskView();

      if(!!opts.user) { this.setUser(opts.user); }

      this.listenTo(this.$sidebar, 'redirect', this.redirect);
      this.listenTo(this.$homeView, 'redirect', this.redirect);
      this.listenTo(this.$taskView, 'redirect', this.redirect);
    },
    
    render: function() {
      var that = this;
      this.$el.html(this.template({user: this.user}));
      this.$('div.sidebar-collapse').html(this.$sidebar.render().el);
      this.delegateEvents();
      this.$sidebar.delegateEvents();
      return this;
    },

    remove: function() {
      this.$sidebar.remove();
      Backbone.View.prototype.remove.call(this);
    }
  });

  return DashboardView;
});