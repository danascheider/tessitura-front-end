define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/dashboard-top-widgets.html'
], function($, _, Backbone, Template) {
  var DashboardTopWidgetView = Backbone.View.extend({
    template: _.template(Template),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
    }
  });

  return DashboardTopWidgetView;
});