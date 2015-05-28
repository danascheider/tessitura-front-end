var CalendarView = Tessitura.View.extend({
  
  /* Backbone View Properties
  /**************************************************************************************/

  template    : JST['calendar'],
  id          : 'calendar',
  className   : 'panel dash-widget',

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

  initialize  : function(opts) {
    //
  },

  render      : function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = CalendarView;