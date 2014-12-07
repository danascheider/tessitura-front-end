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

    // Standard View Methods //

    initialize : function(data) {
      this.data = data;
      this.render();

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'change:backlog', this.render);
    },

    render     : function() {
      var that = this;

      this.$el.html(this.template({data: this.data}));

      this.$quickAddForm = new QuickAddFormView({collection: this.collection});
      this.$el.find('li.quick-add-form').html(this.$quickAddForm.el);

      this.$collectionView = new TaskCollectionView({ collection: this.collection });
      
      this.$el.find('ul').after(this.$collectionView.el);

      this.$el.find('ul').sortable({
        connectWith: '.task-list'
      });
    }
  });

  return KanbanColumnView;
});