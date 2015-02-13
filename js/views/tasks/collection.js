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

    removeBacklog  : function() {
      this.collection.remove(this.collection.findWhere({backlog: true}));
    },

    removeComplete : function() {
      this.collection.remove(this.collection.findWhere({status: 'Complete'}));
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

      if(this.listItemViews.length) { 
        _.each(this.listItemViews, function(view) { 
          view.remove(); 
        });
      }

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