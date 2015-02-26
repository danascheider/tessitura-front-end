define([
  'jquery', 
  'underscore', 
  'backbone',
  'utils',
  'models/task',
  'collections/tasks',
  'views/tasks/collection',
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
      'click .fa-archive'  : 'removeBacklogged'
    },

    template : _.template(TaskPanelTemplate),

    crossOffComplete: function() {
      var task = this.collection.findWhere({status: 'Complete'});
      if(!task) { return }
      this.$collectionView.crossOff(task);
    },

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
      $(e.target).find('i').removeClass('fa-minus').addClass('fa-plus');
    },

    removeBacklogged: function() {
      var task = this.collection.findWhere({backlog: true});
      this.collection.remove(task);
    },

    showToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeIn(100);
    },

    showWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideDown();
      $(e.target).closest('span').removeClass('show-widget').addClass('hide-widget');
      $(e.target).find('i').removeClass('fa-plus').addClass('fa-minus');
    },

    // Core View Functions //

    initialize: function(opts) {
      var that = this;
      this.collection = new TaskCollection(this.filterCollection(that.collection), {comparator: 'position'});
      this.$collectionView = new TaskCollectionView({collection: this.collection});

      this.listenTo(this.collection, 'change:status', this.crossOffComplete);
      this.listenTo(this.collection, 'change:backlog', this.removeBacklogged);
    },

    remove: function() {
      this.$collectionView.remove();
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },

    render: function() {
      var that = this;

      this.$el.html(this.template());
      this.$collectionView.render();
      this.$('.panel-body').html(this.$collectionView.el);

      this.$collectionView.delegateEvents();
      this.delegateEvents();

      this.$collectionView.$el.sortable({
        items: ">*:not(.not-sortable)"
      });

      return this;
    }
  });

  return TaskPanelView;
});