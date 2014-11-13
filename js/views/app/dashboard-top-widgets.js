define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/dashboard-top-widgets.html'
], function($, _, Backbone, Template) {
  var DashboardTopWidgetView = Backbone.View.extend({
    template: _.template(Template),

    events: {
      'mouseenter .dash-widget' : 'changeLinkColor',
      'mouseleave .dash-widget' : 'changeLinkColorBack'
    },

    changeLinkColor: function(e) {
      var div = $(e.target).closest('.dash-widget');
      var color = div.find('.panel-heading').css('background-color');
      div.find('.panel-body').css('color', color);
    },

    changeLinkColorBack: function(e) {
      var link = $(e.target).closest('.dash-widget').find('.panel-body');
      link.css('color', '#ccc')
    },

    initialize: function(opts) {
      this.data = opts.data;
      this.render();

      this.listenTo(this.data.taskCollection, 'add', this.render);
      this.listenTo(this.data.taskCollection, 'remove', this.render);
    },

    render: function() {
      this.$el.html(this.template({data: this.data}));
    }
  });

  return DashboardTopWidgetView;
});