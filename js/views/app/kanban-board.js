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
    tagName    : 'div',
    id         : 'page-wrapper',

    events : {
      'click' : 'logClick'
    },

    logClick: function() {
      console.log('You clicked the Kanban board');
    },

    render     : function() {
      this.$el.html(this.template());
      var that = this;

      window.user.fetchIncompleteTasks().then(function(collection) {
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
      });

      return this;
    }
  });

  return KanbanBoardView;
});