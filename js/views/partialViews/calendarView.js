var moment = require('moment');

Tessitura.CalendarView = Tessitura.DashWidgetView.extend({
  
  /* Backbone View Properties
  /**************************************************************************************/

  template    : JST['calendar'],
  id          : 'calendar',

  /* Tessitura View Methods
  /**************************************************************************************/

  types       : function() {
    return Tessitura.DashWidgetView.prototype.types().concat(['CalendarView', 'PartialView']);
  },

  /* Special functions
  /**************************************************************************************/

  displayDays : function() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
        arr = [];

    for(var i = -1; i < 2; i++) {
      arr.push(days[moment().add(i, 'days').day()]);
    }

    return arr;
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize  : function(opts) {
    //
  },

  render      : function() {
    this.$el.html(this.template({days: this.displayDays()}));
    return this;
  }
});

module.exports = Tessitura.CalendarView;