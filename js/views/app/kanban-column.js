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

    refreshCollection: function() {
      var headline = this.data.headline;

      var bad = this.collection.filter(function(model) {
        return headline === 'Backlog' ? !!model.get('backlog') : model.get('status') !== headline;
      });

      this.collection.remove(bad);
      this.render();
    },

    // Standard View Methods //

    initialize : function(data) {
      this.data = data;
      this.render();

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'change', this.refreshCollection);
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));
      this.$collectionView = new TaskCollectionView({ el: this.$el.find('.panel-body'), 
                                                      collection: this.collection
                                                   });

      this.$collectionView.$el.find('ul').sortable({
        connectWith: '.task-list'
      });
    }
  });

  return KanbanColumnView;
});