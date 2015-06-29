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

  updateTask           : function(task) {
    var needsUpdate = false;

    _.each(this.groupedBy, function(val, key) {
      if(task.get(key) != val) { 
        needsUpdate = true;
      }
    });

    if(needsUpdate) { 
      task.save(this.groupedBy); 
    }
  },

  /* Special Functions
  /**************************************************************************/

  renderCollection     : function() {
    var that      = this;
    var container = document.createDocumentFragment();
    var key       = Object.keys(this.groupedBy)[0];


    this.collection.each(function(task) {
      var skip      = task.get('backlog') && Object.keys(that.groupedBy).indexOf('backlog') === -1;

      if (task.get(key) === that.groupedBy[key] && !skip) {
        var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task});
        
        if (that.childViews.indexOf(view) === -1) {
          that.childViews.push(view);
        }

        view.render();
        container.appendChild(view.el);
      }
    });

    this.$('ul.task-list').append(container);
    return this;  },

  retrieveViewForModel : function(task) {
    if (!this.childViews.length) { return; }

    var child = _.filter(this.childViews, function(view) {
      return view.model === task;
    });

    return child[0];
  },

  setCollection        : function(collection) {
    this.collection = collection;
    this.quickAddForm = new Tessitura.QuickAddFormView({collection: this.collection, groupedBy: this.groupedBy});
    this.childViews.push(this.quickAddForm);

    this.listenTo(this.collection, 'add remove', this.render);
    this.listenTo(this.collection, 'change:backlog', this.removeTask);
    this.listenTo(this.collection, 'change:status', this.crossOff);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize           : function(data) {
    this.data       = data || {};
    this.childViews = [];
    this.data.color = this.data.color || 'primary';
    this.$el.addClass('panel-' + this.data.color);
    this.groupedBy  = this.data.headline === 'Backlog' ?  {backlog: true} : {status: this.data.headline};

    if(this.collection) { this.setCollection(this.collection); }
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

    Tessitura.View.prototype.render.call(this, this.template({data: that.data}), function() {
      that.quickAddForm.render();
      that.$('.quick-add-form').prepend(that.quickAddForm.$el);

      that.renderCollection();

      that.$('ul.task-list').sortable({
        items: '>*:not(.not-sortable)'
      });
    });
  }
});

module.exports = Tessitura.KanbanColumnView;