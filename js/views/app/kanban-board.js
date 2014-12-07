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
    initialize : function(opts) {
      this.user = opts.user;

      var that = this;
      this.user.fetchIncompleteTasks().then(function(collection) {
        that.collection = collection;
        that.render();
        that.listenTo(that.collection, 'remove', that.render);
      });
    },

    render     : function() {
      this.$el.html(this.template());

      var that  = this;

      this.$backlogColumn = new KanbanColumnView({
        el         : that.$el.find('#backlog-tasks'),
        collection : new TaskCollection(that.collection.where({backlog: true})),
        color      : 'red',
        icon       : 'fa-exclamation-circle',
        headline   : 'Backlog',
      });

      var nonBacklog = new TaskCollection(this.collection.models);
      nonBacklog.remove(that.$backlogColumn.collection.models);

      this.$newColumn = new KanbanColumnView({
        el         : that.$el.find('#new-tasks'),
        collection : new TaskCollection(nonBacklog.where({status: 'New'})),
        color      : 'blue',
        icon       : 'fa-certificate',
        headline   : 'New'
      });

      this.$inProgressColumn = new KanbanColumnView({
        el         : that.$el.find('#in-progress-tasks'),
        collection : new TaskCollection(nonBacklog.where({status: 'In Progress'})),
        color      : 'green',
        icon       : 'fa-road',
        headline   : 'In Progress'
      });

      this.$blockingColumn = new KanbanColumnView({
        el         : that.$el.find('#blocking-tasks'),
        collection : new TaskCollection(nonBacklog.where({status: 'Blocking'})),
        color      : 'yellow',
        icon       : 'fa-minus-circle',
        headline   : 'Blocking'
      });

      return this;
    }
  });

  return KanbanBoardView;
});