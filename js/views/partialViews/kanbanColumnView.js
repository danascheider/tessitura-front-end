/****************************************************************************
 *                                                                         *
 * KANBAN COLUMN VIEW                                                      *
 *                                                                         *
 * The Kanban column view displays information about the user's tasks,     *
 * sorted by status. Each column has tasks of one status: In Progress,     *  
 * New, Blocking, or Backlogged. In the future, users may be able to       *
 * access their completed tasks as well.                                   *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 33   *
 * Module-Specific Requires ......................................... 39   *
 * Module ........................................................... 47   *
 *   Backbone View Properties ....................................... 52   *
 *   Canto View Properties .......... ............................... 59   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *     types                                                               *
 *   Special Functions .............................................. 69   *
 *     setCollection() .............................................. 85   *
 *   Core Functions ................................................. 97   *
 *     initialize() ................................................. 97   *
 *     remove() .................................................... 105   * 
 *     render() .................................................... 111   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

/* Module-Specific Requires
/****************************************************************************/

var CollectionView = require('../collectionViews/taskCollectionView.js');

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var KanbanColumnView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/kanbanCol'],
  className   : 'panel dash-widget kanban-column',

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'KanbanColumnView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',

  types       : function() {
    return Canto.View.prototype.types().concat(['KanbanColumnView', 'KanbanColumn', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************/

  removeTask  : function(task) {
    this.collection.remove(task);
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
    this.collectionView = new CollectionView({collection: this.collection});

    this.listenTo(this.collection, 'add', this.updateTask);
    this.listenTo(this.collection, 'change:backlog', this.removeTask);
  },

  /* Core View Functions
  /**************************************************************************/

  initialize    : function(data) {
    this.data = data || {};
    
    this.data.color = this.data.color || 'primary';
    this.$el.addClass('panel-' + this.data.color);

    this.groupedBy = this.data.headline === 'Backlog' ?  {backlog: true} : {status: this.data.headline};

    if(!!this.data.collection) { this.setCollection(this.data.collection); }
  },

  remove      : function() {
    this.collectionView.remove();
    Canto.View.prototype.remove.call(this);
  },

  render      : function() {
    var that = this;

    Canto.View.prototype.render.call(this, this.template({data: that.data}), function() {
      that.collectionView.render();
      that.$('.panel-body').html(that.collectionView.$el);
    });
  }
});

module.exports = KanbanColumnView;