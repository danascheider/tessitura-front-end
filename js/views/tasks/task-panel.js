define([
  'jquery', 
  'underscore', 
  'backbone',
  'utils',
  'api',
  'models/task',
  'collections/tasks',
  'views/tasks/model',
  'views/tasks/collection',
  'views/tasks/quick-add-form',
  'text!templates/partials/task-panel.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    Utils,
    API,
    TaskModel,
    TaskCollection,
    TaskModelView,
    TaskCollectionView,
    QuickAddFormView,
    TaskPanelTemplate,
    CreateFormTemplate,
    BootstrapStyles,
    DashboardStyles,
    CantoStyles,
    FAStyles) {

  var TaskPanelView = Backbone.View.extend({
    el       : $('#task-panel'),

    events   : {
      'click a.create-task' : 'showTaskForm',
      'mouseenter'          : 'showToggleWidgetIcon',
      'mouseleave'          : 'hideToggleWidgetIcon',
      'click .hide-widget'  : 'hideWidget',
      'click .show-widget'  : 'showWidget',
      'click .fa-archive'   : 'removeTask'
    },

    template : _.template(TaskPanelTemplate),

    hideToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeOut(100);
    },

    hideWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideUp();
      $(e.target).closest('span').removeClass('hide-widget').addClass('show-widget');
      $(e.target).removeClass('fa-minus').addClass('fa-plus');
    },

    removeTask: function(e) {
      var id = $(e.target).closest('.task-list-item').attr('id').match(/\d+$/)[0];
      var task = this.collection.findWhere({id: parseInt(id)});
      this.collection.remove(task);
    },

    showToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeIn(100);
    },

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    showWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideDown();
      $(e.target).closest('span').removeClass('show-widget').addClass('hide-widget');
      $(e.target).removeClass('fa-plus').addClass('fa-minus');
    },

    // Core View Functions //

    initialize: function() {
      this.render();
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
    },

    render: function() {
      var that = this;

      this.$el.html(this.template());

      this.$quickAddForm = new QuickAddFormView({collection: this.collection});
      this.$el.find('li.quick-add-form').html(this.$quickAddForm.el);


      if(this.collection.length) {
        var tasks = this.collection.filter(function(task) {
          return task.get('status') !== 'Blocking' && !task.get('backlog');
        });

        this.collection = new TaskCollection(tasks.slice(0,10));

        this.$collectionView = new TaskCollectionView({ collection: that.collection });

        this.$el.find('ul').after(this.$collectionView.el);
        this.$el.find('ul').sortable();
      }

      return this;
    }
  });

  return TaskPanelView;
});