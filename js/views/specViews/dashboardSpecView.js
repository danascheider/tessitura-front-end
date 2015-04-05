Canto = Canto || require('../../dependencies.js');

var Dashboard = require('../appViews/dashboardView.js'),
    User      = require('../../models/userModel.js');

var user1 = new User({id: 1, username: 'user1', password: 'user1', email: 'user1@example.com', first_name: 'User', last_name: 'One'});
var user2 = new User({id: 2, username: 'user2', password: 'user2', email: 'user2@example.com', first_name: 'User', last_name: 'Two'});

var SpecWrapper = Backbone.View.extend({
  el        : 'body',
  template  : JST['spec/dashboard'],

  events    : {
    'click a[data-method=hideDropdownMenus]' : 'callHideDropdownMenus',
    'click a[data-method=redirect]'          : 'callRedirect',
    'click a[data-method=setUser]'           : 'callSetUser',
    'click a[data-method=toggleDropdownMenu]': 'callToggleDropdownMenu',
    'click a[data-method=showHomeView]'      : 'callShowHomeView',
    'click a[data-method=showTaskView]'      : 'callShowTaskView'
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  callHideDropdownMenus  : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('#page-wrapper')});
    this.view.hideDropdownMenus(ev);
  },

  callToggleDropdownMenu : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('a.dropdown-toggle').first()});
    this.view.toggleDropdownMenu(ev);
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize: function() {
    this.view = new Dashboard({user: user1});
  },

  render    : function() {
    this.$el.html(this.template());
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.view.delegateEvents();
  }
});

module.exports = SpecWrapper;