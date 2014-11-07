define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'models/task',
  'views/tasks/create-form',
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
      'click .fa-square-o'  : 'markComplete',
      'click th.task-title' : 'toggleTaskDetails',
      'click a.create-task' : 'toggleCreateForm',
    },

    // Event Handlers //
    markComplete      : function(e) {
      var that = this;
      var tableRow = $(e.target).closest('tr');
      var modelID = tableRow.attr('id').match(/\d+/)[0];

      var markComplete = new Promise(function(resolve, reject) {
        that.collection.get(modelID).save({status: 'Complete'}, {
          dataType    : 'html',
          type        : 'PUT',
          url         : API.tasks.single(modelID),
          beforeSend  : function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
          },
          success     : function(model, status, xhr) {
            resolve(that.collection.get(modelID));
          },
          error       : function(xhr, status, object) {
            reject(object);
          }
        });
      });

      markComplete.then(function(task) {

        // Check the checkbox and add strikethrough to the task title

        var li = $('#task-' + modelID).closest('li');
        li.find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
        li.find('.task-title > a').css('text-decoration', 'line-through');

        var getRidOfTask = function() { that.collection.remove(task); }
        window.setTimeout(getRidOfTask, 750);
      });
    },

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
      this.listenTo(this.collection, 'sync', this.render);
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

      return this;
    }
  });

  return TaskCollectionView;
});