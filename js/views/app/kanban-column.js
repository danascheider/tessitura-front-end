define([
  'jquery',
  'underscore',
  'backbone',
  'jquery-ui',
  'views/tasks/collection',
  'views/tasks/quick-add-form',
  'text!templates/partials/kanban-column.html'
], function($, _, Backbone, JQueryUI, TaskCollectionView, QuickAddFormView, Template) {
  var KanbanColumnView = Backbone.View.extend({
    template   : _.template(Template),

    renderChildViews : function() {
      this.$collectionView = new TaskCollectionView({collection: this.collection});
      this.$quickAddForm = new QuickAddFormView({collection: this.collection});
      this.$('.panel-body').html(this.$collectionView.el);
      this.$quickAddForm.$el.prependTo(this.$collectionView.el);

      this.$collectionView.$el.sortable({
        items: '>*:not(".not-sortable")'
      });
    },

    // Core View Methods //

    initialize : function(data) {
      this.data = data;
      this.render();

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'change:backlog', this.render);
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));
      this.renderChildViews();
      
      return this;
    }
  });

  return KanbanColumnView;
});