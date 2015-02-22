define([
  'jquery', 
  'underscore', 
  'backbone',
  'utils',
  'models/task',
  'collections/tasks',
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
    TaskModel,
    TaskCollection,
    TaskCollectionView,
    QuickAddFormView,
    TaskPanelTemplate) {

  var TaskPanelView = Backbone.View.extend({
    tagName   : 'div',
    id        : 'task-panel',
    className : 'panel panel-primary dash-widget',

    events   : {
      'mouseenter'         : 'showToggleWidgetIcon',
      'mouseleave'         : 'hideToggleWidgetIcon',
      'click .hide-widget' : 'hideWidget',
      'click .show-widget' : 'showWidget',
      'click .fa-archive'  : 'removeTask'
    },

    template : _.template(TaskPanelTemplate),

    filterCollection: function(collection) {
      var tasks = collection.filter(function(task) {
        return task.get('status') !== 'Blocking' && !task.get('backlog');
      });

      return tasks.slice(0,10);
    },

    hideToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeOut(100);
    },

    hideWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideUp();
      $(e.target).closest('span').removeClass('hide-widget').addClass('show-widget');
      $(e.target).removeClass('fa-minus').addClass('fa-plus');
    },

    // FIX: Is there a reason this can't be in the collection view?
    removeTask: function(e) {
      var id = $(e.target).closest('.task-list-item').attr('id').match(/\d+$/)[0];
      var task = this.collection.findWhere({id: parseInt(id)});
      this.collection.remove(task);
    },

    showToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeIn(100);
    },

    // FIX: What does this actually do and why? Does it pertain to the 
    //      now-defunct create form?

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target;
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    showWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideDown();
      $(e.target).closest('span').removeClass('show-widget').addClass('hide-widget');
      $(e.target).removeClass('fa-plus').addClass('fa-minus');
    },

    // Core View Functions //

    initialize: function(opts) {
      var that = this;
      this.collection = new TaskCollection(this.filterCollection(that.collection), {comparator: 'position'});
      this.$quickAddForm = new QuickAddFormView({collection: this.collection});
      this.$collectionView = new TaskCollectionView({collection: this.collection});
    },

    remove: function() {
      this.$collectionView.remove();
      this.$quickAddForm.remove();
    },

    render: function() {
      var that = this;

      this.$el.html(this.template());
      this.$collectionView.render();
      this.$quickAddForm.render();
      this.$('.panel-body').html(this.$collectionView.el);
      this.$quickAddForm.$el.prependTo(this.$collectionView.el);
      this.delegateEvents();
      this.$collectionView.delegateEvents();
      this.$quickAddForm.delegateEvents();
      
      this.$collectionView.$el.sortable({
        items: ">*:not(.not-sortable)"
      });

      return this;
    }
  });

  return TaskPanelView;
});