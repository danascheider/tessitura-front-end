Tessitura.DashWidgetView = Tessitura.View.extend({
  className   : function() {
    return 'panel panel-primary dash-widget'
  },

  events      : {
    'click span.toggle-widget > i' : 'toggleWidget'
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  klass       : 'DashWidgetView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(['DashWidgetView', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************************/

  toggleWidget: function(e) {
    this.$('.panel-body').slideToggle();
    $(e.target).toggleClass('fa-minus fa-plus');
  },
});

module.exports = Tessitura.DashWidgetView;