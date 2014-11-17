define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/collection',
  'text!templates/partials/kanban-column.html'
], function($, _, Backbone, TaskCollectionView, Template) {
  var KanbanColumnView = Backbone.View.extend({
    template   : _.template(Template),

    initialize : function(data) {
      this.data = data;
      this.render();
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));
      this.$collectionView = new TaskCollectionView({ el: this.$el.find('.panel-body'), 
                                                      collection: this.collection
                                                   });
    }
  });

  return KanbanColumnView;
});