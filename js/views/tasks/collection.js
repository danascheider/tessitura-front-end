define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'jquery-ui',
  'api',
  'utils',
  'models/task',
  'views/tasks/create-form',
  'views/tasks/list-entry',
  'text!templates/tasks/model.html'
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  JQueryUI,
  API,
  Utils,
  TaskModel,
  CreateFormView,
  ListEntryView,
  ModelTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({

    // Templates //
    modelTemplate      : _.template(ModelTemplate),

    tagName            : 'ul',
    className          : 'task-list',

    // Event Handlers //

    crossOff : function() {
      this.collection.remove(this.collection.findWhere({status: 'Complete'}));
      this.render();
    },

    // Core View Functions //

    initialize: function() {
      this.render();

      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'markComplete', this.crossOff);
    },

    render: function() {
      var that = this;

      this.collection.each(function(task) {
        var view = new ListEntryView({modelTemplate: that.modelTemplate, model: task});
        that.$el.append(view.$el);
      });

      this.$el.sortable({connectWith: '.task-list', dropOnEmpty: true})

      return this;
    }
  });

  return TaskCollectionView;
});