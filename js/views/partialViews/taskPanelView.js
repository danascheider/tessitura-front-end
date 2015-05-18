var TaskPanelView = Tessitura.View.extend({
  id                   : 'task-panel',
  className            : 'panel panel-primary dash-widget',
  template             : JST['partials/taskPanel'],

  events               : {
    'click span.toggle-widget i' : 'toggleWidget',
  },

  /* Tessitura View Properties
  /**************************************************************************************/

  klass                : 'TaskPanelView',
  family               : 'Tessitura.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Tessitura.View.prototype.types().concat(['TaskPanelView', 'TaskPanel', 'TaskView', 'PartialView']);
  },

  /* Event Callbacks
  /**************************************************************************************/

  addTaskToDisplay     : function() {

    if (this.collection.length > this.collectionView.collection.length) {
      var index = (this.collectionView.collection.length - 1) + 1,
          model = this.collection.at(index);

      this.collectionView.collection.add(model);
    }
  },

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

  removeBacklog        : function() {
    this.collectionView.removeBacklog();
  },

  showTaskCreateForm   : function(e) {
    var c = this.collectionView.collection;
    this.trigger('showTaskCreateForm', {collection: this.collection});
  },

  toggleWidget         : function(e) {
    this.$('.panel-body').slideToggle();
    $(e.target).toggleClass('fa-minus fa-plus');
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize           : function() {
    this.collection       = new Tessitura.TaskCollection(this.filterCollection());
    var displayCollection = new Tessitura.TaskCollection(this.collection.slice(0,10));
    this.collectionView   = new Tessitura.TaskCollectionView({collection: displayCollection});

    this.childViews = [this.collectionView];

    this.listenTo(this.collection, 'change:status', this.crossOffComplete);
    this.listenTo(this.collection, 'change:backlog', this.removeBacklog);
    this.listenTo(this.collectionView.collection, 'remove', this.addTaskToDisplay);
  },

  remove               : function() {
    this.collectionView.remove();
    Backbone.View.prototype.remove.call(this);
  },

  render               : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.collectionView.render();
      that.$('.panel-body').html(that.collectionView.$el);
    });
  }
});

module.exports = TaskPanelView;