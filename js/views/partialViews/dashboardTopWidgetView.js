Tessitura.DashboardTopWidgetView = Tessitura.View.extend({
  id                  : 'dashboard-top-widgets',
  template            : JST['partials/topWidgets'],

  /* Core View Functions
  /**************************************************************************************/

  initialize          : function(data) {
    this.data = data || {};

    // For convenience, make the data available as own properties
    // of the view.

    _.extend(this, this.data); 

    this.listenTo(this.taskCollection, 'add remove change:status', this.render);
  },
  
  render              : function() {
    Tessitura.View.prototype.render.call(this, this.template(this.data));
  }
});

module.exports = Tessitura.DashboardTopWidgetView;