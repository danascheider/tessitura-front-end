define([
  'jquery',
  'underscore',
  'backbone',
  'jquery-ui',
  'views/tasks/collection',
  'text!templates/partials/kanban-column.html'
], function($, _, Backbone, JQueryUI, TaskCollectionView, Template) {
  var KanbanColumnView = Backbone.View.extend({
    template   : _.template(Template),

    // Standard View Methods //

    initialize : function(data) {
      this.data = data;
      this.render();

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.logRemoval);
      this.listenTo(this.collection, 'change:status', this.render);
      this.listenTo(this.collection, 'change:backlog', this.render);
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));
      this.$collectionView = new TaskCollectionView({ el: this.$el.find('.panel-body'), 
                                                      collection: this.collection
                                                   });

      this.$collectionView.$el.find('ul').sortable({
        connectWith: '.task-list'
      });

      var first = this.collection.at(0);
    }
  });

  return KanbanColumnView;
});