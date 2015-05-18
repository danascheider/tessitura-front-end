var ListItemView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************************/

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

  /* Tessitura View Properties
  /**************************************************************************************/

  klass      : 'TaskListItemView',
  family     : 'Tessitura.View',
  superFamily: 'Backbone.View',

  types      : function() {
    return Tessitura.View.prototype.types().concat(['TaskListItemView', 'ListItemView']);
  },

  /* Event Callbacks
  /**************************************************************************************/

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
    this.$('a.task-title').css('text-decoration', 'line-through');
  },

  showEditForm      : function() {
  },

  showEditIcons     : function() {
    this.$('span.edit-task').show();
  },

  toggleTaskDetails : function(e) {
    if(e) { e.preventDefault(); }
    this.$el.toggleClass('open', {duration: 400});
    this.$('.task-details').slideToggle();
  },

  /* Special Functions
  /**************************************************************************************/

  configureDraggable : function() {
    var that   = this;

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

          _.each(items, function(item) {
            var model = coll.get($(item).attr('id').match(/(\d+)/)[0]);
            if (model.get('position') !== i) {
              model.save({position: i});
            }
          });
        } else if (column.innerText === 'Backlog') {
          that.model.save('backlog', true);
        } else {
          that.model.save('status', column.innerText, {
            beforeSend: function(xhr) {
              xhr.addRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
            }
          });
        }

        that.trigger('drop');
        that.render();
      }
    });
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize         : function() {
    this.modelView = new Tessitura.TaskModelView({model: this.model});
    this.childViews = [this.modelView];
  },

  remove             : function() {
    this.modelView.remove();
    Backbone.View.prototype.remove.call(this);
  },

  render             : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.modelView.render();
      that.$('td.task-listing').html(that.modelView.$el);
      that.configureDraggable();
      that.$el.removeAttr('style');
    });
  }
});

module.exports = ListItemView;