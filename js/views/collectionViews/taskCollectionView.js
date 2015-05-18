var TaskCollectionView = Tessitura.View.extend({
  tagName              : 'ul',
  className            : 'task-list',
  template             : JST['collections/task'],

  /* Tessitura View Properties
  /**************************************************************************************/

  klass                : 'TaskCollectionView',
  family               : 'Tessitura.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Tessitura.View.prototype.types().concat(['TaskCollectionView', 'TaskView']);
  },

  /* Event Callbacks
  /**************************************************************************************/

  crossOff             : function(task) {
    if(task.get('status') !== 'Complete') { return; }

    var that = this, 
        view = this.retrieveViewForModel(task);

    setTimeout(function() {
      if(view) { view.destroy(); }
      that.collection.remove(task);
    }, 750);
  },

  fetchCollection      : function() {
    this.collection.fetch();
  },

  removeBacklog        : function() {
    var backlog = this.collection.where({backlog: true});

    for(var i=0; i < backlog.length; i++) {
      var view = this.retrieveViewForModel(backlog[i]);
      this.collection.remove(backlog[i]);
      if(view) { view.destroy(); }
    }
  },

  removeComplete       : function() {
    var complete = this.collection.where({status: 'Complete'});

    for(var i=0; i < complete.length; i++) {
      var view = this.retrieveViewForModel(complete[i]);
      this.collection.remove(complete[i]);
      if(view) { view.destroy(); }
    }
  },

  showTaskCreateForm   : function() {
    this.trigger('showTaskCreateForm', {collection: this.collection});
  },

  /* Special Functions
  /**************************************************************************************/

  removeChildViews     : function() {
    _.each(this.childViews, function(view) {
      view.remove();
    });
  },

  removeStyles         : function() {
    _.each(this.childViews, function(view) {
      view.$el.removeAttr('style');
    });
  },

  renderCollection     : function() {
    var that = this;

    var container = document.createDocumentFragment();

    this.collection.each(function(task) {
      var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task});
      if (that.childViews.indexOf(view) === -1) {
        that.childViews.push(view);
      }

      view.render();
      container.appendChild(view.el);
    });

    this.$el.append(container);
  },

  retrieveViewForModel : function(model) {
    if(!this.childViews.length) { return null; }

    var view = _.filter(this.childViews, function(view) {
      return view.model === model;
    });

    return view[0];
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize          : function(opts) {
    opts = opts || {};

    this.grouping     = opts.grouping;
    this.childViews   = [];
    this.quickAddForm = new Tessitura.QuickAddFormView({collection: this.collection, grouping: this.grouping});

    this.listenTo(this.collection, 'add fetch', this.render);
    this.listenTo(this.collection, 'change:status', this.crossOff);
    this.listenTo(this.collection, 'remove', this.removeChildAndRender);
    this.listenTo(this.collection, 'drop', this.removeStyles);
    this.listenTo(this.quickAddForm, 'showTaskCreateForm', this.showTaskCreateForm);
  },

  remove              : function() {
    this.removeChildViews();
    Backbone.View.prototype.remove.call(this);
  },

  removeChildAndRender: function(task) {
    var view  = this.retrieveViewForModel(task),
        index = this.childViews.indexOf(view);
    this.childViews.splice(index, 1);
    this.render();
  },

  render              : function() {
    var view, that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.quickAddForm.render();
      that.$('li.quick-add-form').html(that.quickAddForm.$el);
      that.renderCollection();
      that.$el.sortable({
        items : '>*:not(.not-sortable)'
      });
    });
  }
});

module.exports = TaskCollectionView;