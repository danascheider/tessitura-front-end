Tessitura.KanbanColumnView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/kanbanCol'],
  className   : 'panel dash-widget kanban-column',

  /* Tessitura View Properties
  /**************************************************************************/

  klass       : 'KanbanColumnView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',

  types       : function() {
    return Tessitura.View.prototype.types().concat(['KanbanColumnView', 'KanbanColumn', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  removeTask  : function(task) {
    if(!(this.groupedBy.backlog && task.get('backlog'))) { 
      this.collection.remove(task);
    }
  },

  updateTask  : function(task) {
    var needsUpdate = false;

    _.each(this.groupedBy, function(val, key) {
      if(task.get(key) != val) { 

        // Since this is not set to false at any point,
        // it is not necessary to break out of the loop at this point,
        // except if performance concerns come up later. We'll cross that
        // bridge when we come to it since this is the simplest implementation.

        needsUpdate = true;
      }
    });

    if(needsUpdate) { 
      task.save(this.groupedBy); 
    }
  },

  /* Core View Functions
  /**************************************************************************/

  setCollection : function(collection) {
    this.collection = collection;
    this.collectionView = new Tessitura.TaskCollectionView({collection: this.collection});
    this.childViews.push(this.collectionView);

    this.listenTo(this.collection, 'add', this.updateTask);
    this.listenTo(this.collection, 'change:backlog', this.removeTask);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize    : function(data) {
    this.data = data || {};
    
    this.data.color = this.data.color || 'primary';
    this.$el.addClass('panel-' + this.data.color);

    this.groupedBy  = this.data.headline === 'Backlog' ?  {backlog: true} : {status: this.data.headline};
    this.childViews = [];

    if(!!this.data.collection) { this.setCollection(this.data.collection); }
  },

  remove      : function() {
    if(!!this.childViews.length) { 
      _.each(this.childViews, function(view) {
        view.remove(); 
      });
    }
    
    Tessitura.View.prototype.remove.call(this);
  },

  render      : function() {
    var that = this;

    Tessitura.View.prototype.render.call(this, this.template({data: that.data}), function() {
      that.collectionView.render();
      that.$('.panel-body').html(that.collectionView.$el);
    });
  }
});

module.exports = Tessitura.KanbanColumnView;