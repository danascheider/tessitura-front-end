var user1 = new Tessitura.UserModel({id: 1, username: 'user1', password: 'user1', email: 'user1@example.com', first_name: 'User', last_name: 'One'});
var user2 = new Tessitura.UserModel({id: 2, username: 'user2', password: 'user2', email: 'user2@example.com', first_name: 'User', last_name: 'Two'});

var SpecWrapper = Backbone.View.extend({
  el        : 'body',
  template  : JST['spec/dashboard'],

  events    : {
    'click a[data-method=hideDropdownMenus]' : 'callHideDropdownMenus',
    'click a[data-method=hideSidebar]'       : 'callHideSidebar',
    'click a[data-method=redirect]'          : 'callRedirect',
    'click a[data-method=setUser]'           : 'callSetUser',
    'click a[data-method=toggleDropdownMenu]': 'callToggleDropdownMenu',
    'click a[data-method=toggleSidebar]'     : 'callToggleSidebar',
    'click a[data-method=showHomeView]'      : 'callShowHomeView',
    'click a[data-method=showTaskView]'      : 'callShowTaskView',
    'click a[data-method=showSidebar]'       : 'callShowSidebar'
  },

  /* Event Callbacks 
  /**************************************************************************************/

  callHideDropdownMenus  : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('#page-wrapper')});
    this.view.hideDropdownMenus(ev);
  },

  callHideSidebar        : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('dblclick', {target: that.view.$el});
    this.view.hideSidebar(ev);
  },

  callShowSidebar        : function(e) {
    e.preventDefault();
    var that = this;

    if(!this.view.$('#side-menu').is(':visible')) { 
      var ev = $.Event('click', {target: that.view.$('.navbar-brand').first()});
      that.view.toggleSidebar(ev);
    }
  },

  callToggleDropdownMenu : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('a.dropdown-toggle').first()});
    this.view.toggleDropdownMenu(ev);
  },

  callToggleSidebar      : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('.navbar-brand')});
    this.view.toggleSidebar(ev);
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize: function() {
    this.view = new Tessitura.DashboardView({user: user1});
  },

  render    : function() {
    this.$el.html(this.template());
    this.$el.addClass('test');
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.view.delegateEvents();
  }
});

module.exports = SpecWrapper;