define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'collections/tasks',
  'views/app/kanban-column',
  'text!templates/partials/kanban-board.html',
  'css!stylesheets/canto.css',
], function($, _, Backbone, API, TaskCollection, KanbanColumnView, Template) {
  var KanbanBoardView = Backbone.View.extend({
    template   : _.template(Template),

    // FIX: I think having using `tagName` and `id` cause a new element to be 
    //      added to the DOM, when it would be better to have the Kanban board
    //      attached to the existing div

    tagName    : 'div',
    id         : 'page-wrapper',

    initialize : function(opts) {
      opts = opts || {};
      this.user = opts.user;
    },

    render     : function() {
      this.$el.html(this.template());
      var that = this;

      this.user.fetchIncompleteTasks({
        success: function(collection) {
          that.$backlogColumn = new KanbanColumnView({
            el         : that.$('#backlog-tasks'),
            collection : new TaskCollection(collection.where({backlog: true})),
            color      : 'red',
            icon       : 'fa-exclamation-circle',
            headline   : 'Backlog'
          });

          collection.remove(that.$backlogColumn.collection.models);

          that.$newColumn = new KanbanColumnView({
            el         : that.$('#new-tasks'),
            collection : new TaskCollection(collection.where({status: 'New'})),
            color      : 'blue',
            icon       : 'fa-certificate',
            headline   : 'New'
          });

          that.$inProgressColumn = new KanbanColumnView({
            el         : that.$('#in-progress-tasks'),
            collection : new TaskCollection(collection.where({status: 'In Progress'})),
            color      : 'green',
            icon       : 'fa-road',
            headline   : 'In Progress'
          });

          that.$blockingColumn = new KanbanColumnView({
            el         : that.$('#blocking-tasks'),
            collection : new TaskCollection(collection.where({status: 'Blocking'})),
            color      : 'yellow',
            icon       : 'fa-minus-circle',
            headline   : 'Blocking'
          });
        }
      });

      return this;
    },

    reset      : function() {
      if(this.$backlogColumn) { this.$backlogColumn.remove(); }
      if(this.$newColumn) { this.$newColumn.remove(); }
      if(this.$inProgressColumn) { this.$inProgressColumn.remove(); }
      if(this.$blockingColumn) { this.$blockingColumn.remove(); }

      this.remove();
      return this;
    }
  });

  return KanbanBoardView;
});