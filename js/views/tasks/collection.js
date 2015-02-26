define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'jquery-ui',
  'api',
  'utils',
  'models/task',
  'views/tasks/list-entry',
  'views/tasks/quick-add-form',
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
  ListItemView,
  QuickAddForm, 
  ModelTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    tagName            : 'ul',
    className          : 'task-list',

    template           : _.template('<li class=\'quick-add form not-sortable\'><%= form %></li>'),

    // ------------------- // 
    // Custom View Methods //
    // ------------------- //

    crossOff          : function(task) {
      var that = this;

      this.$('#task-' + task.get('id')).find('.task-title').css('text-decoration', 'line-through');
      setTimeout(function() {
        that.collection.remove(task);
      }, 750);
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

    initialize: function(opts) {
      opts               = opts || {};
      this.grouping      = opts.grouping || {};
      this.childViews    = this.childViews || [];
      this.$quickAddForm = new QuickAddForm({collection: this.collection, grouping: this.grouping});

      // FIX: Why is the refreshCollection function needed here?
      //      Will it overwrite changes that have been made client-side
      //      but not yet synced with the server? 

      this.listenTo(this.collection, 'remove', this.refreshCollection);
      this.listenTo(this.collection, 'add', this.refreshCollection);
      this.listenTo(this.collection, 'markComplete', this.removeComplete);
      this.listenTo(this.collection, 'change:backlog', this.removeBacklog);
    },

    render: function() {
      var that = this;

      this.$quickAddForm.render();
      this.$el.html(this.template({form: this.$quickAddForm.$el.html()}));
      
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