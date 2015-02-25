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

    // ------------------- // 
    // Custom View Methods //
    // ------------------- //

    crossOff          : function(task) {
      this.$('#task-' + task.get('id')).find('.task-title').css('text-decoration', 'line-through');
    }, 

    // -------------- //
    // Event Handlers //
    // -------------- //

    refreshCollection : function() {
      this.collection.fetch({add: false});
      this.render();
    },

    removeBacklog  : function() {
      this.collection.remove(this.collection.findWhere({backlog: true}));
    },

    removeComplete : function() {
      var task = this.collection.findWhere({status: 'Complete'});
      this.collection.remove(task);
    },

    // FIX: This should be replaced by a custom `remove` function that removes
    //      all the child views before cleaning up the parent.

    reset          : function() {
      this.remove();
      var coll = this.collection;
      this.initialize({collection: coll});
      return this;
    },

    // Core View Functions //

    initialize: function() {

      // FIX: Why is the refreshCollection function needed here?
      //      Will it overwrite changes that have been made client-side
      //      but not yet synced with the server? 

      // FIX: Why on earth is the quick-add form not included here???
      //      Why is it defined in the task panel and kanban column views??

      this.listenTo(this.collection, 'remove', this.refreshCollection);
      this.listenTo(this.collection, 'add', this.refreshCollection);
      this.listenTo(this.collection, 'markComplete', this.removeComplete);
      this.listenTo(this.collection, 'change:backlog', this.removeBacklog);
    },

    render: function() {
      var that = this;
      this.$el.html('');
      
      this.collection.each(function(task) {
        var view = new ListItemView({model: task});
        that.$el.append(view.render().el);
      });
  
      this.delegateEvents();

      this.$el.sortable({connectWith: '.task-list', dropOnEmpty: true});

      return this;
    }
  });

  return TaskCollectionView;
});