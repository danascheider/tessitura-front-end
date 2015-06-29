Tessitura.KanbanColumnView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template             : JST['partials/kanbanCol'],
  className            : 'panel dash-widget kanban-column',

  /* Tessitura View Properties
  /**************************************************************************/

  klass                : 'KanbanColumnView',
  family               : 'Tessitura.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Tessitura.View.prototype.types().concat(['KanbanColumnView', 'KanbanColumn', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  crossOff             : function(task) {
    if(task.get('status') !== 'Complete') { return; }

    var that = this, 
        view = this.retrieveViewForModel(task);

    setTimeout(function() {
      if (view) {
        that.childViews.splice(that.childViews.indexOf(view), 1);
        view.destroy();
      }

      that.collection.remove(task);
    }, 750);
  },

  // The `removeTask` callback is called when the backlog status of a task
  // in the collection is changed. If this column is the backlog column, the
  // task is not removed from the collection if its backlog status is changed
  // TO `true`. Otherwise, the task is removed.

  removeTask           : function(task) {
    if(!(this.groupedBy.backlog && task.get('backlog'))) { 
      this.collection.remove(task);
    }
  },

  /* Special Functions
  /**************************************************************************/

  renderModels         : function() {
    var that      = this;
    var container = document.createDocumentFragment();
    var key       = Object.keys(this.groupedBy)[0];

    for (var i = 0; i < this.models.length; i++) {
      var task = this.models[i]

      if(task.get('backlog') && key !== 'backlog') { continue; }

      var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task});

      if (that.childViews.indexOf(view) === -1) {
        that.childViews.push(view);
      }

      view.render();
      container.appendChild(view.el);
    }

    this.$('ul.task-list').append(container);
    return this;  
  },

  retrieveViewForModel : function(task) {
    if (!this.childViews.length) { return; }

    var child;

    _.each(this.childViews, function(view) {
      if(view.model && view.model.get('id') === task.get('id')) {
        child = view;
      }
    });

    return child;
  },

  /* Core View Functions
  /**************************************************************************/

  initialize           : function(data) {
    data            = data || {};
    _.extend(this, data);

    var that = this;

    this.quickAddForm = new Tessitura.QuickAddFormView({collection: that.collection, groupedBy: this.groupedBy});
    this.childViews = [this.quickAddForm];

    this.$el.addClass('panel-' + this.color);
  },

  remove               : function() {
    if(!!this.childViews.length) { 
      _.each(this.childViews, function(view) {
        view.remove(); 
      });
    }
    
    Tessitura.View.prototype.remove.call(this);
  },

  render               : function() {
    var that = this;

    Tessitura.View.prototype.render.call(this, this.template({data: this}), function() {
      that.quickAddForm.render();
      that.$('.quick-add-form').prepend(that.quickAddForm.$el);

      that.renderModels();

      that.$('ul.task-list').sortable({
        items: '>*:not(.not-sortable)'
      });
    });
  }
});

module.exports = Tessitura.KanbanColumnView;