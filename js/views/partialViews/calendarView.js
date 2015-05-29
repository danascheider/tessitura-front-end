var CalendarView = Tessitura.View.extend({
  
  /* Backbone View Properties
  /**************************************************************************************/

  template    : JST['calendar'],
  id          : 'calendar',
  className   : 'panel dash-widget panel-primary',

  /* Tessitura View Methods
  /**************************************************************************************/

  klass       : 'CalendarView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(['CalendarView', 'PartialView']);
  },

  /* Special functions
  /**************************************************************************************/

  displayDays : function() {
    var days  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date(), today = new Date();
    var arr   = [];

    for(var i = -2; i < 3; i++) {
      var number = today.getDate() + i;
      arr.push(days[(new Date(date.setDate(number)).getDay())]);
    }

    return arr;
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