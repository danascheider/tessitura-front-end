define([
  'jquery', 
  'underscore', 
  'backbone',
  'views/tasks/empty-panel',
  'text!templates/partials/task-panel.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    EmptyPanelView,
    TaskPanelTemplate,
    CreateFormTemplate,
    BootstrapStyles,
    DashboardStyles,
    CantoStyles,
    FAStyles) {

  var TaskPanelView = Backbone.View.extend({
    el       : $('#task-panel'),

    events   : {
      'click a.create-task' : 'showTaskForm'
    },

    template : _.template(TaskPanelTemplate),

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    render: function() {
      this.$el.append(this.template());
      var emptyPanel = new EmptyPanelView({el: $(this.el).find('.panel-body')});
      emptyPanel.render();
      return this;
    }
  });

  return TaskPanelView;
});