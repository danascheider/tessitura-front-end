define([
  'jquery', 
  'underscore', 
  'backbone',
  'views/tasks/create-form',
  'text!templates/partials/task-panel.html',
  'text!templates/partials/empty-task-panel.html',
  'text!templates/tasks/create-form.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    CreateFormView,
    TaskPanelTemplate,
    EmptyPanelTemplate,
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

    emptyTemplate: _.template(EmptyPanelTemplate),

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    render: function() {
      var panelContent = this.emptyTemplate({createForm: CreateFormTemplate});
      this.$el.html(this.template({panelContent: panelContent}));
      return this;
    }
  });

  return TaskPanelView;
});