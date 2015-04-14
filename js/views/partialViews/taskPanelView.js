var TaskPanelView = Canto.View.extend({
  id                   : 'task-panel',
  className            : 'panel panel-primary dash-widget',
  template             : JST['partials/taskPanel'],

  events               : {
    'click span.toggle-widget i' : 'toggleWidget',
  },

  /* Canto View Properties
  /**************************************************************************************/

  klass                : 'TaskPanelView',
  family               : 'Canto.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Canto.View.prototype.types().concat(['TaskPanelView', 'TaskPanel', 'TaskView', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************************/

  crossOffComplete     : function() {
    var that = this;

    var complete = this.collection.where({status: 'Complete'});
    _.each(complete, function(task) {
      that.collectionView.crossOff(task);
    });
  },

  filterCollection     : function() {
    var tasks = _.filter(this.collection.models, function(task) {
      return task.get('status') !== 'Blocking' && !task.get('backlog');
    });

    return tasks
  },

  removeBacklogged     : function() {
    var that = this;
    var backlogged = this.collection.where({backlog: true});
   _.each(backlogged, function(task) { that.collection.remove(task); });
  },

  toggleWidget         : function(e) {
    this.$('.panel-body').slideToggle();
    $(e.target).toggleClass('fa-minus fa-plus');
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize           : function() {
    this.collection       = new Canto.TaskCollection(this.filterCollection());
    var displayCollection = new Canto.TaskCollection(this.collection.slice(0,10));
    this.collectionView   = new Canto.TaskCollectionView({collection: newColl});

    this.listenTo(this.collection, 'change:status', this.crossOffComplete);
    this.listenTo(this.collection, 'change:backlog', this.removeBacklogged);
    this.listenTo(this.collection, 'add remove', this.render);
  },

  remove               : function() {
    this.collectionView.remove();
    Backbone.View.prototype.remove.call(this);
    this.undelegateEvents();
  },

  render               : function() {
    var that = this;

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.collectionView.render();
      that.$('.panel-body').html(that.collectionView.$el);
    });
  }
});

module.exports = TaskPanelView;