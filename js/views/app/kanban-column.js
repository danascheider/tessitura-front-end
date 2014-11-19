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

    events     : {
      'ul receive' : 'logEvent'
    },

    logEvent : function() {
      console.log('Logging event')
    },

    initialize : function(data) {
      this.data = data;
      this.render();
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));
      this.$collectionView = new TaskCollectionView({ el: this.$el.find('.panel-body'), 
                                                      collection: this.collection
                                                   });

      this.$collectionView.$el.find('ul').sortable({
        connectWith: '.task-list',
        receive: function(e, ui) {
          //
        }
      });
    }
  });

  return KanbanColumnView;
});