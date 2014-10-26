define([
  'jquery', 
  'underscore', 
  'backbone',
  'views/tasks/model',
  'views/tasks/collection',
  'views/tasks/empty-panel',
  'text!templates/partials/task-panel.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    TaskModelView,
    TaskCollectionView,
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

    checkIfTasks: function() {
      return this.tasks ? true : false;
    },

    renderContent: function() {
      if(this.checkIfTasks() === true) {
        var collectionView = new TaskCollectionView({tasks: this.tasks, el: $(this.el).find('.panel-body')});
        collectionView.render();
      } else {
        var emptyPanel = new EmptyPanelView({el: $(this.el).find('.panel-body')});
        emptyPanel.render();
      }
    },

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    // Core View Functions //

    initialize: function(tasks) {
      this.tasks = JSON.parse(tasks.tasks) || {};
    },

    render: function() {
      console.log('Task Panel is being rendered');
      this.$el.append(this.template());
      this.renderContent();
      return this;
    }
  });

  return TaskPanelView;
});