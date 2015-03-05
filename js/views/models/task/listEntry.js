define([
  'jquery',
  'underscore',
  'backbone',
  'jquery-ui',
  'api',
  'utils',
  'collections/tasks',
  'views/models/task/updateForm',
  'views/models/task/model',
  'text!templates/tasks/list-entry.html',
], function(
  $, 
  _, 
  Backbone, 
  JQueryUI,
  API, 
  Utils, 
  TaskCollection,
  UpdateFormView, 
  ModelView, 
  ListEntryTemplate
) {

  var ListItemView = Backbone.View.extend({
    tagName   : 'li',
    id        : function() { return 'task-' + this.model.get('id'); },
    className : 'ui-widget-content ui-draggable ui-draggable-handle task-list-item',
    template  : _.template(ListEntryTemplate),

    events    : {
      'click .fa-pencil'   : 'showEditForm',
      'click .fa-square-o' : 'markComplete',
      'click .fa-times'    : 'deleteTask',
      'click .fa-archive'  : 'backlogTask',
      'click a.task-title' : 'toggleTaskDetails',
      'click button:reset' : 'hideEditForm',
      'mouseenter'         : 'showEditIcons',
      'mouseleave'         : 'hideEditIcons'
    },

    // This needs to be configured here because it is the draggable element,
    // even though the draggability mainly pertains to the parent list.

    configureDraggable: function() {
      var that = this;

      this.$el.draggable({
        containment: 'parent',
        connectToSortable: '.task-list',

        // FIX: Start and stop functions should vary depending on what view
        //      they are rendered in. One possibility would be to pass the
        //      start and stop functions to this view as an option on 
        //      instantiation.

        stop: function() {
          var column = $(this).closest('.kanban-col').find('.panel-heading')[0];

          // At this point, sorting only works on the dashboard. On
          // the Kanban board, tasks change status when dragged and 
          // dropped, but do not change their list position. I may or
          // may not want to change this in the future.
          
          if (!column) {

            // Find out the order of the list. The `items` array is the 
            // array of `li`s in the parent list, and `coll` is the 
            // collection. Within the `each` loop these lists are compared
            // to make sure the `position` of the item in the collection at
            // a given index is the same as the item's actual position in
            // the list. If the actual position differs from the `position`
            // attribute of the model, the actual position is changed.

            // The back-end also implements an equivalent sorting algorithm.
            // Consequently, it is not necessary to sync with the server at
            // this point, and doing so might even cause problems.

            var items = that.$el.closest('ul').children('li.task-list-item'), coll = that.model.collection;

            // Iterator
            var i = 1;

            // FIX: This should trigger an event rather than changing the 
            //      positions of the models itself

            _.each(items, function(item) {
              var model = coll.get($(item).attr('id').match(/(\d+)/)[0]);
              if (model.get('position') !== i) {
                model.set({position: i});
              }
            });
          } else if (column.innerText === 'Backlog') {
            that.model.set('backlog', true);
          } else {
            that.model.set('status', column.innerText);
          }

          that.model.collection.updateAll({
            success: function() {
              that.changePosition();
            }
          });
        }
      });
    },

    // --------------- //
    // Event Callbacks //
    // --------------- //

    backlogTask       : function() {
      this.model.save({backlog: true});
    },

    // When the list item is dragged and dropped, by default an
    // inline style is placed that causes problems with the 
    // rest of my UI. This method takes it away and renders the
    // list item without the inline style.
    changePosition  : function() {
      this.$el.removeAttr('style');
      this.render();
    },

    deleteTask        : function() {
      this.model.destroy();
    },

    hideEditForm      : function() {
      var that = this;

      this.$editForm.$el.slideUp();
      this.$editForm.remove();

      window.setTimeout(function() {
        that.$modelView.render();
        that.$('td.task-listing').html(that.$modelView.el);
        that.$('span.edit-task').show();
        that.$('span.edit-task').css('visibility', 'hidden');
      }, 50);
    },

    hideEditIcons     : function() {
      this.$('span.edit-task').css('visibility', 'hidden');
    },

    markComplete      : function() {
      this.$('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
      this.model.save({status: 'Complete'});
    },

    showEditForm      : function() {
      this.$('span.edit-task').fadeOut(150);

      var that = this;

      window.setTimeout(function() {
        that.$modelView.remove();
        that.$editForm.render().$el.removeAttr('style');
        that.$('td.task-listing').html(that.$editForm.el);
      }, 150);
    },

    showEditIcons     : function() {
      if(!this.$('form').is(':visible')) {
        this.$('span.edit-task').css('visibility', 'visible');
      }
    },

    toggleTaskDetails : function(e) {
      e.preventDefault();
      var target = $(e.target);
      var table  = target.siblings('table');
      $(table).toggle();
    },

    // ----------------------- //
    // Standard View Functions // 
    // ----------------------- //

    initialize: function() {
      this.$editForm = new UpdateFormView({model: this.model});
      this.$modelView = new ModelView({model: this.model});
      this.listenTo(this.$editForm, 'done', this.render);
    },

    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      this.$modelView.delegateEvents();

      this.$modelView.render();
      this.$('td.task-listing').html(this.$modelView.el);

      this.configureDraggable();
      
      return this;
    }
  });

  return ListItemView;
});