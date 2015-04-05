Canto      = Canto || require('../../../dependencies.js');
Canto.View = Canto.View || ('../../appViews/cantoView.js');

var TaskModel = require('../../../models/taskModel.js'),
    ModelView = require('./taskModelView.js');

var ListItemView = Canto.View.extend({
  tagName    : 'li',
  className  : 'task-list-item ui-widget-content ui-draggable',
  id         : function() { return 'task-' + this.model.get('id'); },
  template   : JST['tasks/listItem'],

  events     : {
    'click i[title=Edit]'    : 'showEditForm',
    'click i[title=Delete]'  : 'deleteTask',
    'click i[title=Backlog]' : 'backlogTask',
    'click .fa-square-o'     : 'markComplete',
    'click .task-title'      : 'toggleTaskDetails',
    'mouseenter'             : 'showEditIcons',
    'mouseleave'             : 'hideEditIcons'
  },

  // --------------------- //
  // Canto View Properties //
  // --------------------- //

  klass      : 'TaskListItemView',
  family     : 'Canto.View',
  superFamily: 'Backbone.View',

  types      : function() {
    return Canto.View.prototype.types().concat(['TaskListItemView', 'ListItemView']);
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  backlogTask        : function() {
    this.model.save({backlog: true});
  },

  deleteTask         : function() {
    this.model.destroy();
  },

  hideEditIcons     : function() {
    this.$('span.edit-task').hide();
  },

  markComplete      : function() {
    this.model.save({status: 'Complete'});
    this.$('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
  },

  showEditForm      : function() {
  },

  showEditIcons     : function() {
    this.$('span.edit-task').show();
  },

  toggleTaskDetails : function(e) {
    if(e) { e.preventDefault(); }
    this.$('.task-details').slideToggle();
  },

  // ----------------- //
  // Special Functions //
  // ----------------- //

  // When the list item is dragged and dropped, by default an
  // inline style is placed that causes problems with the 
  // rest of my UI. This method takes it away and renders the
  // list item without the inline style.
  
  changePosition  : function() {
    this.$el.removeAttr('style');
    this.render();
  },

  configureDraggable : function() {
    this.$el.draggable({
      containment       : 'parent',
      connectToSortable : '.task-list',

      // FIX: This is untested. We need tests for the stop function
      //      but I haven't implemented them yet because of issues
      //      involving unit-testing functionality that encompasses
      //      multiple elements.

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

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize         : function() {
    this.modelView = new ModelView({model: this.model});
  },

  remove             : function() {
    this.modelView.remove();
    Backbone.View.prototype.remove.call(this);
  },

  render             : function() {
    var that = this;

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.modelView.render();
      that.$('td.task-listing').html(that.modelView.$el);
    });
  }
});

module.exports = ListItemView;