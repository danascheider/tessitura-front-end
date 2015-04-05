Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var DashboardSidebarView = Canto.View.extend({
  tagName              : 'ul',
  className            : 'nav',
  id                   : 'side-menu',
  template             : JST['partials/sidebar'],

  events               : {
    'click a.sidebar-link'       : 'toggleSecondLevelNav',
    'click li > .dashboard-link' : 'goToDashboard',
    'click li > .task-page-link' : 'goToTaskPage'
  },

  // --------------------- //
  // Canto View Properties //
  // --------------------- //

  klass                : 'DashboardSidebarView',
  family               : 'Canto.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Canto.View.prototype.types().concat(['DashboardView', 'DashboardSidebarView', 'PartialView']);
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  goToDashboard        : function() {
    this.trigger('redirect', {destination: 'dashboard'});
  },

  goToTaskPage         : function() {
    this.trigger('redirect', {destination: 'tasks'});
  },

  toggleSecondLevelNav : function(e) {
    var li = $(e.target).closest('li');

    if(!li.hasClass('active')) {
      li.siblings('li').removeClass('active');
      this.$('.nav-second-level:visible').slideUp();
      li.addClass('active').find('.nav-second-level').slideDown();
    } else {
      li.removeClass('active').find('.nav-second-level').slideUp();
    }

    if(li.className === '') { li.removeAttr('class'); }
  },

  // ----------------- //
  // Special Functions //
  // ----------------- //

  // For testing purposes - location.hash can't be stubbed
  // directly, so this has to be called in the methods that 
  // require the information.

  getLocationHash      : function() {
    return location.hash;
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  render               : function() {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = DashboardSidebarView;