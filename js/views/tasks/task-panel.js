define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/partials/task-panel.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    TaskPanelTemplate,
    BootstrapStyles,
    DashboardStyles,
    CantoStyles,
    FAStyles) {

  var TaskPanelView = Backbone.View.extend({
    el       : $('#task-panel'),

    template : _.template(TaskPanelTemplate),

    render: function() {
      this.$el.html(this.template);
      return this;
    }
  });

  return TaskPanelView;
});