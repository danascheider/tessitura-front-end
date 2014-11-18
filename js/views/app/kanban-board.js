define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'collections/tasks',
  'views/app/kanban-column',
  'css!stylesheets/canto.css',
  'text!templates/partials/kanban-board.html'
], function($, _, Backbone, API, TaskCollection, KanbanColumnView, CantoStyles, Template) {
  var KanbanBoardView = Backbone.View.extend({
    template   : _.template(Template),
    tagName    : 'div',
    initialize : function(opts) {
      this.user = opts.user
      this.render();
    },

    render     : function() {
      this.$el.html(this.template());

      var that  = this;
      this.user.fetchIncompleteTasks().then(function(collection) {
        that.collection = collection;

        that.$backlogColumn = new KanbanColumnView({
          el         : that.$el.find('#backlog-tasks'),
          collection : that.collection,
          color      : 'red',
          icon       : 'fa-exclamation-circle',
          headline   : 'Backlog',
        });

        that.$newColumn = new KanbanColumnView({
          el         : that.$el.find('#new-tasks'),
          collection : new TaskCollection(that.collection.where({status: 'New'})),
          color      : 'blue',
          icon       : 'fa-certificate',
          headline   : 'New'
        });

        that.$inProgressColumn = new KanbanColumnView({
          el         : that.$el.find('#in-progress-tasks'),
          collection : new TaskCollection(that.collection.where({status: 'In Progress'})),
          color      : 'green',
          icon       : 'fa-road',
          headline   : 'In Progress'
        });

        that.$blockingColumn = new KanbanColumnView({
          el         : that.$el.find('#blocking-tasks'),
          collection : new TaskCollection(that.collection.where({status: 'Blocking'})),
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