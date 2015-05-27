var CalendarView = Tessitura.View.extend({
  
  /* Backbone View Properties
  /**************************************************************************************/

  template    : JST['calendar'],
  id          : 'calendar',
  className   : 'panel panel-primary dash-widget',

  /* Tessitura View Methods
  /**************************************************************************************/

  klass       : 'CalendarView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(['CalendarView', 'PartialView']);
  },

  /* Core View Functions
  /**************************************************************************************/

  render      : function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = CalendarView;