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

  retrieveViewForModel : function(task) {
    if(!this.childViews.length) { return; }

    var child = _.filter(this.childViews, function(view) {
      return view.model === task;
    });

    return child[0];
  },

  showTaskCreateForm   : function(e) {
    this.trigger('showTaskCreateForm', {collection: this.collection});
  },

  /* Special Functions 
  /**************************************************************************************/

  renderCollection     : function() {
    var that = this;
    var i    = 0
    var container = document.createDocumentFragment();

    this.collection.each(function(task) {
      if (i > 9) { return; }

      if (task.get('status') !== 'Blocking' && task.get('status') !== 'Complete' && !task.get('backlog')) {
        var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task});
        
        if (that.childViews.indexOf(view) === -1) {
          that.childViews.push(view);
        }

        view.render();
        container.appendChild(view.el);
        i++;
      }
    });

    this.$('ul.task-list').append(container);
    return this;
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize           : function(opts) {
    this.quickAddForm     = new Tessitura.QuickAddFormView({collection: this.collection});

    this.childViews = [this.quickAddForm];

    this.listenTo(this.collection, 'add fetch', this.render);
    this.listenTo(this.collection, 'change:status', this.crossOff);
    this.listenTo(this.collection, 'change:backlog', this.render);
    this.listenTo(this.collection, 'drop', this.removeStyles);
    this.listenTo(this.collection, 'remove', this.render);
    this.listenTo(this.quickAddForm, 'showTaskCreateForm', this.showTaskCreateForm);
  },

  remove               : function() {
    _.each(this.childViews, function(view) { view.remove(); });
    Tessitura.View.prototype.remove.call(this);
  },

  render               : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.quickAddForm.render();
      that.$('.quick-add-form').prepend(that.quickAddForm.$el);
      that.renderCollection();

      that.$('ul').sortable({
        items: '>*:not(.not-sortable)'
      });
    });
  }
});

module.exports = Tessitura.TaskPanelView;