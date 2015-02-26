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
    className  : 'panel dash-widget kanban-column',

    events     : {
      'submit form.quick-add-form' : 'createTask'
    },

    // FIX: This should be moved to the quick-add form itself. Then the 
    //      column view should listen to the quick add form and add the 
    //      newly created task to its collection. The reason I hesitate
    //      to do this already is that I can't think of how to cause the
    //      quick-add form to create the task with the attribute that 
    //      constitutes the grouping of the column view. Possibly just let
    //      it add the task to the collection and live with the 2nd 
    //      REST request? 

    createTask : function(e) {
      e.preventDefault();
      var that = this, form  = $(e.target), attrs = Utils.getAttributes(form);

      _.each(this.groupedBy, function(value,key) { attrs[key] = value; });

      if(!!attrs.title) {
        this.collection.create(attrs, {
          success: function(model) {
            form[0].reset();
          }
        });
      }
    },

    updateTask : function(task) {
      var needsUpdate;

      _.each(this.groupedBy, function(value, attr) {
        if(task.get(attr) != value) {
          needsUpdate = needsUpdate || true;
        }
      });

      if(needsUpdate) { task.save(this.groupedBy); }
    },

    // Core View Methods //

    initialize : function(data) {
      this.data = data || {};
      this.data.color = this.data.color || 'primary';

      this.$el.addClass('panel-' + this.data.color);

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

      this.$quickAddForm.render();
      this.$collectionView.render();
      this.$('.panel-body').html(this.$collectionView.el);
      this.$collectionView.$el.prepend(this.$quickAddForm.el);

      this.delegateEvents();
      this.$quickAddForm.delegateEvents();
      this.$collectionView.delegateEvents();
      
      return this;
    },

    remove      : function() {
      this.$collectionView.remove();
      this.$quickAddForm.remove();
      Backbone.View.prototype.remove.call(this);

      return this;
    }
  });

  return KanbanColumnView;
});