Tessitura.DashboardSidebarView = Tessitura.View.extend({
  tagName              : 'ul',
  className            : 'nav',
  id                   : 'side-menu',
  template             : JST['partials/sidebar'],

  events               : {
    'click a.sidebar-link' : 'toggleSecondLevelNav'
  },

  /* Event Callbacks
  /*************************************************************************************/

  toggleSecondLevelNav : function(e) {
    var li = $(e.target).closest('li');

    if(!li.hasClass('active')) {
      li.siblings('li').removeClass('active');
      this.$('.nav-second-level:visible').slideUp();
      li.addClass('active').find('.nav-second-level').slideDown();
    } else {
      li.removeClass('active').find('.nav-second-level').slideUp();
    }
  },

  /* Special Functions
  /**************************************************************************************/

  // For testing purposes - location.hash can't be stubbed
  // directly, so this has to be called in the methods that 
  // require the information.

  getLocationHash      : /* istanbul ignore next*/ function() {
    return location.hash;
  },

  /* Core View Functions
  /**************************************************************************************/

  render               : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.DashboardSidebarView;