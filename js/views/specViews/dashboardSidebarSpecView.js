Canto = Canto || require('../../dependencies.js');

var Sidebar = require('../partialViews/dashboardSidebarView.js');

var SpecWrapper = Backbone.View.extend({
  el        : 'body',
  template  : JST['spec/sidebar'],

  events    : {
    'click a[data-method=showTargetNav]'        : 'showTargetNav',
    'click a[data-method=toggleSecondLevelNav]' : 'callToggleSecondLevelNav',
    'click a[data-method=showLastNav]'          : 'showLastNav'
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  callToggleSecondLevelNav : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('a[href=#]:contains("UI Elements")').first() });
    this.view.toggleSecondLevelNav(ev);
  },

  showLastNav              : function(e) {
    e.preventDefault();
    var that = this;

    var ev = $.Event('click', {target: that.view.$('a[href=#]').last() });
    if(!this.view.$('a[href="blank.html"]').is(':visible')) {
      this.view.toggleSecondLevelNav(ev);
    }
  },

  showTargetNav            : function(e) {
    e.preventDefault();
    var that = this,
        ev = $.Event('click', {target: that.view.$('a[href=#]:contains("UI Elements")').first() });

    if(!this.view.$('a[href="panels-wells.html"]').is(':visible')) {
      this.view.toggleSecondLevelNav(ev);
    }    
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize: function() {
    this.view = new Sidebar();
  },

  render    : function() {
    this.$el.html(this.template());
    this.delegateEvents();
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.view.delegateEvents();
  }
});

module.exports = SpecWrapper;