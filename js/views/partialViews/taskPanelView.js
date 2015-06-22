Tessitura.TaskPanelView = Tessitura.DashWidgetView.extend({
  id                   : 'task-panel',
  template             : JST['partials/taskPanel'],

  /* Tessitura View Properties
  /**************************************************************************************/

  klass                : 'TaskPanelView',
  family               : 'Tessitura.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Tessitura.DashWidgetView.prototype.types().concat(['TaskPanelView', 'TaskPanel', 'TaskView', 'PartialView']);
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

  filterCollection     : function() {
    var tasks = _.filter(this.collection.models, function(task) {
      return task.get('status') !== 'Blocking' && !task.get('backlog');
    });

    return tasks;
  },

  removeBacklog        : function() {
    this.collectionView.removeBacklog();
  },

  showTaskCreateForm   : function(e) {
    var c = this.collectionView.collection;
    this.trigger('showTaskCreateForm', {collection: this.collection});
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize           : function(opts) {
    this.collection       = new Tessitura.TaskCollection(this.filterCollection());
    var displayCollection = new Tessitura.TaskCollection(this.collection.slice(0,10));
    this.collectionView   = new Tessitura.TaskCollectionView({collection: displayCollection});

    this.childViews = [this.collectionView];

    this.listenTo(this.collection, 'change:backlog', this.removeBacklog);
    this.listenTo(this.collectionView.collection, 'remove', this.addTaskToDisplay);
  },

  remove               : function() {
    _.each(this.childViews, function(view) { view.remove(); });
    Tessitura.View.prototype.remove.call(this);
  },

  render               : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.collectionView.render();
      that.$('.panel-body').html(that.collectionView.$el);
    });
  }
});

module.exports = Tessitura.TaskPanelView;