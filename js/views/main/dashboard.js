define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/partials/dashboardSidebar',
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
      if(typeof e === 'string' && e.match(/redirect\:/)) { this.trigger(e); }
    },

    setUser           : function(user) {
      this.user = user;
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

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize: function(opts) {
      opts = opts || {};
      if(!!opts.user) { this.setUser(opts.user); }
      this.$sidebar = new SidebarView();

      this.listenTo(this.$sidebar, 'all', this.redirect);
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