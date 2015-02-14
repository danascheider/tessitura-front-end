define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'jquery-ui',
  'api',
  'utils',
  'models/task',
  'views/tasks/create-form',
  'views/tasks/list-entry',
  'text!templates/tasks/model.html'
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  JQueryUI,
  API,
  Utils,
  TaskModel,
  CreateFormView,
  ListItemView,
  ModelTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    tagName            : 'ul',
    className          : 'task-list',

    // Event Handlers //

    refreshCollection : function() {
      this.collection.fetch({add: false});
      this.render();
    },


    refreshViews   : function() {
      var views = this.listItemViews;
      var that = this;

      // Remove all the existing list item views before creating new ones
      // and adding them to the array of child views

      if(views.length > 0) {
        _.each(views, function(view) {
          view.remove();
          that.listItemViews.splice(views.indexOf(view), 1);
        });
      }
    },

    removeBacklog  : function() {
      this.collection.remove(this.collection.findWhere({backlog: true}));
    },

    removeComplete : function() {
      this.collection.remove(this.collection.findWhere({status: 'Complete'}));
    },

    reset          : function() {
      this.remove();
      this.initialize();
    },

    // Core View Functions //

    initialize: function() {

      // FIX: Why is the refreshCollection function needed here?
      this.listenTo(this.collection, 'remove', this.refreshCollection);
      this.listenTo(this.collection, 'add', this.refreshCollection);
      this.listenTo(this.collection, 'markComplete', this.removeComplete);
      this.listenTo(this.collection, 'change:backlog', this.removeBacklog);
    },

    render: function() {
      var that = this;
      this.listItemViews = this.listItemViews || [];

      // Before re-rendering, clean up list item views so 
      // list doesn't keep getting longer & so zombies don't 
      // accumulate

      this.refreshViews();

      this.collection.each(function(task) {
        var view = new ListItemView({model: task});
        that.listItemViews.push(view);
        that.$el.append(view.$el);
      });

      this.$el.sortable({connectWith: '.task-list', dropOnEmpty: true});

      return this;
    }
  });

  return TaskCollectionView;
});