define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'api',
  'models/task',
  'jquery-ui',
  'views/tasks/collection',
  'text!templates/partials/kanban-column.html'
], function($, _, Backbone, Utils, API, TaskModel, JQueryUI, TaskCollectionView, Template) {
  
  var KanbanColumnView = Backbone.View.extend({ 
    template   : _.template(Template),

    tagName    : 'div',
    className  : 'panel dash-widget kanban-column',

    updateTask : function(task) {
      var needsUpdate = false;

      _.each(this.groupedBy, function(value, attr) {
        if(task.get(attr) != value) {
          needsUpdate = true;
        }
      });

      if(needsUpdate) { 
        task.save(this.groupedBy); 
        this.render();
      }
    },

    // ----------------- //
    // Core View Methods //
    // ----------------- //

    initialize : function(data) {
      this.data = data || {};
      this.data.color = this.data.color || 'primary';

      this.$el.addClass('panel-' + this.data.color);

      // FIX: Grouping should be a property of the collection,
      //      not of any of the views.

      this.groupedBy = this.data.headline === 'Backlog' ?  {backlog: true} : {status: this.data.headline};

      this.$collectionView = new TaskCollectionView({collection: this.collection, grouping: this.groupedBy});

      // FIX: When a task is added, the collection should also pop a 
      //      task off the end of the collection, so it maintains 
      //      its length.

      this.listenTo(this.collection, 'add', this.updateTask);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'change:backlog', this.render);
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));

      this.$collectionView.render();
      this.$('.panel-body').html(this.$collectionView.el);

      this.delegateEvents();
      this.$collectionView.delegateEvents();
      
      return this;
    },

    remove      : function() {
      this.$collectionView.remove();
      Backbone.View.prototype.remove.call(this);

      return this;
    }
  });

  return KanbanColumnView;
});