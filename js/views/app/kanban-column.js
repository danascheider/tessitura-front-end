define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'api',
  'models/task',
  'jquery-ui',
  'views/tasks/collection',
  'views/tasks/quick-add-form',
  'text!templates/partials/kanban-column.html'
], function($, _, Backbone, Utils, API, TaskModel, JQueryUI, TaskCollectionView, QuickAddFormView, Template) {
  
  var KanbanColumnView = Backbone.View.extend({
    template   : _.template(Template),

    tagName    : 'div',

    events     : {
      'submit form.quick-add-form' : 'createTask'
    },

    // FIX: This should be moved to the quick-add form itself. Then the 
    //      column view should listen to the quick add form and add the 
    //      newly created task to its collection.

    createTask : function(e) {
      e.preventDefault();
      var that = this, form  = $(e.target), attrs = Utils.getAttributes(form);

      _.each(this.groupedBy, function(value,key) { attrs[key] = value; });

      var newTask = new TaskModel(attrs);

      if(!!attrs.title) {
        newTask.save(newTask.attrs, {
          url: API.tasks.collection($.cookie('userID')),
          beforeSend: Utils.authHeader,
          success: function(model) {
            form[0].reset();
            that.collection.add(model);
          },
          error: function(model, response) {
            form[0].reset();
            console.log('Error: ', response);
          }
        });
      }
    },

    updateTask : function(task) {
      task.save({status: this.taskStatus}, {
        beforeSend: Utils.authHeader,
        error     : function(model, response) {
          console.log('Unable to update task: ', response);
        }
      });
    },

    // Core View Methods //

    initialize : function(data) {
      this.data = data || {};

      this.className = 'panel panel-' + this.data.color + ' dash-widget kanban-column';

      this.groupedBy = this.data.headline === 'Backlog' ?  {backlog: true} : {status: this.data.headline};

      this.$collectionView = new TaskCollectionView({collection: this.collection});
      this.$quickAddForm = new QuickAddFormView({collection: this.collection});

      this.listenTo(this.collection, 'add', this.updateTask);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'change:backlog', this.render);
      this.listenTo(this.$quickAddForm, 'submit', this.createTask);
    },

    render     : function() {
      this.$el.html(this.template({data: this.data}));

      this.$('.panel-body').append(this.$quickAddForm.render().el);
      this.$('.panel-body').append(this.$collectionView.render().el);

      this.$quickAddForm.delegateEvents();

      this.$collectionView.$el.sortable({
        items: '>*:not(".not-sortable")',
      });
      
      return this;
    },

    reset      : function() {
      this.$collectionView.remove();
      this.remove();

      this.initialize();
      return this;
    }
  });

  return KanbanColumnView;
});