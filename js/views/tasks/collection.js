define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'models/task',
  'views/tasks/create-form',
  'views/tasks/list-entry',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
  'text!templates/tasks/collection.html',
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  API,
  TaskModel,
  CreateFormView,
  ListEntryView,
  ModelTemplate, 
  ListEntryTemplate, 
  CollectionTemplate
) {
  
  var TaskCollectionView = Backbone.View.extend({

    // Templates //

    template           : _.template(CollectionTemplate),
    modelTemplate      : _.template(ModelTemplate),
    listItemTemplate   : _.template(ListEntryTemplate),

    // Events //

    events : {
      'click th.task-title' : 'toggleTaskDetails',
      'click a.create-task' : 'toggleCreateForm',
    },

    // Event Handlers //
    toggleCreateForm  : function(e) {
      e.preventDefault();
      var form = this.$el.find('form.task-form');
      $(form).slideToggle();
    },

    toggleTaskDetails : function(e) {
      e.preventDefault();
      var target = e.target;
      var siblings = $(target).closest('tr').siblings();
      $(siblings).toggle();
    },

    // Core View Functions //

    initialize: function() {
      this.render();
      this.listenTo(this.collection, 'remove', this.render);
    },

    render: function() {
      this.$el.html(this.template({ 
                                    collection: this.collection,
                                    listItemTemplate: this.listItemTemplate,
                                    modelTemplate: this.modelTemplate
                                  }));

      this.$createForm = new CreateFormView({
                                             el: this.$el.find('li.widget-create-form'),
                                             collection: this.collection 
                                           });

      var that = this;

      this.collection.each(function(task) {
        var listEntry = new ListEntryView({
          modelTemplate: that.modelTemplate,
          el: that.$el.find('li#task-' + task.get('id')),
          model: task
        });
      });

      return this;
    }
  });

  return TaskCollectionView;
});