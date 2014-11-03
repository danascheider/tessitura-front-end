define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/dashboard-top-widgets.html'
], function($, _, Backbone, Template) {
  var DashboardTopWidgetView = Backbone.View.extend({
    template: _.template(Template),

    initialize: function(opts) {
      this.data = opts.data
      this.render();
    },

    render: function() {
      this.$el.html(this.template({data: this.data}));
    }
  });

  return DashboardTopWidgetView;
});