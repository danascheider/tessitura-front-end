Tessitura.DashWidgetView = Tessitura.View.extend({
  className   : function() {
    return 'panel panel-primary dash-widget'
  },

  template    : _.template('<div class="panel-heading"><span class="toggle-widget"><i class="fa fa-minus fa-fw"></i></span></div></div><div class="panel-body"></div>'),

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

  render      : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.DashWidgetView;