Tessitura.DashboardHomeView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template         : JST['partials/dashHome'],
  id               : 'page-wrapper',
  className        : 'dashboard-home',

  /* Tessitura View Properties
  /**************************************************************************/

  klass            : 'DashboardHomeView',
  family           : 'Tessitura.View',
  superFamily      : 'Backbone.View',
  types            : function() {
    return Tessitura.View.prototype.types().concat(['DashboardHomeView', 'PartialView']);
  },

  /* Special Functions
  /**************************************************************************/

  renderCalendarView  : function() {
    this.calendarView.render();
    this.$('div.col-lg-8').first().html(this.calendarView.$el);
  },

  renderTaskPanelView : function() {
    this.taskPanelView.render();
    this.$('div.col-lg-4').first().html(this.taskPanelView.$el);
  },

  renderTopWidgetView : function() {
    this.topWidgetView.render();
    this.$('.row').first().html(this.topWidgetView.$el);
  },

  setUser             : function(user) {
    this.user       = user;
    this.collection = this.user.tasks;

    // Create view elements
    var that = this;
    this.taskPanelView = new Tessitura.TaskPanelView({collection: this.collection});
    this.topWidgetView = new Tessitura.DashboardTopWidgetView({
      taskCollection: that.user.tasks,
      deadlineCount: 7,
      appointmentCount: 4,
      recommendationCount: 14
    });

    this.calendarView = new Tessitura.CalendarView({user: this.user});

    this.childViews = [this.calendarView, this.taskPanelView, this.topWidgetView];
  },

  /* Core View Functions
  /**************************************************************************/

  initialize          : function(opts) {
    opts = opts || {};
    if(!!opts.user) { this.setUser(opts.user); }
  },

  remove              : function() {

    // This is fascinating and may be a bug in one of the tools I'm using.
    // Attempting to iterate through the `childViews` array using underscore's
    // `each` function causes the final statement (`Tessitura.View.prototype.remove.call(this)`)
    // throw the error 'TypeError: Cannot read property `remove` of undefined'.
    // 
    // It is unclear why it does that, as logging `Tessitura.View.prototype` to the
    // console still does work and does indicate the existence of a `remove` function.

    try {
      this.calendarView.remove();
      this.taskPanelView.remove();
      this.topWidgetView.remove();
    } catch(e) {
      if (!(this.calendarView && this.taskPanelView && this.topWidgetView)) { return; }
    }

    Tessitura.View.prototype.remove.call(this);
  },

  render              : function(opts) {
    opts = opts || {};

    var that = this;

    return Tessitura.View.prototype.render.call(that, that.template(), function() {
      that.taskPanelView && that.renderTaskPanelView();
      that.topWidgetView && that.renderTopWidgetView();
      that.calendarView && that.renderCalendarView();
    });
  }
});

module.exports = Tessitura.DashboardHomeView;