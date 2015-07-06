Tessitura.KanbanColumnView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template             : JST['partials/kanbanCol'],
  className            : 'panel dash-widget kanban-column',

  /* Event Callbacks
  /**************************************************************************/

  crossOff             : function(task) {
    if(task.get('status') !== 'Complete') { this.collection.remove(task); }

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
  // in the collection is changed. If this column is the backlog column and
  // the task's backlog status has been changed TO true, then it is not removed.
  // Otherwise, it is removed.

  removeTask           : function(task) {
    if(!(this.groupedBy.backlog && task.get('backlog'))) { 
      this.collection.remove(task);
    }
  },

  updateAndRender      : function(task) {
    var attributes = this.groupedBy;

    if(!this.groupedBy.backlog && task.get('backlog')) { attributes.backlog = false; }

    task.save(attributes);
  },

  /* Special Functions
  /**************************************************************************/

  renderModels         : function() {
    var that      = this;
    var container = document.createDocumentFragment();
    var key       = Object.keys(this.groupedBy)[0];

    for (var i = 0; i < this.collection.length; i++) {
      var task = this.collection.models[i]

      /* istanbul ignore next */ if(task.get('backlog') && key !== 'backlog') { continue; }

      var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task, width: 30});

      /* istanbul ignore else */
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
    /* istanbul ignore next */ if (!this.childViews.length) { return; }

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
    data            = data || /* istanbul ignore next */ {};
    _.extend(this, data);
    _.extend(this.models, Backbone.Events);

    this.quickAddForm = new Tessitura.QuickAddFormView({collection: this.collection, groupedBy: this.groupedBy});
    this.childViews = [this.quickAddForm];

    this.$el.addClass('panel-' + this.color);
    this.listenTo(this.collection, 'add', this.updateAndRender);
    this.listenTo(this.collection, 'remove', this.render);
    this.listenTo(this.collection, 'change:status', this.crossOff);
  },

  remove               : function() {
    /* istanbul ignore else */
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