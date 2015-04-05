Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var QuickAddForm = require('../modelViews/taskViews/quickAddFormView.js');
var ListItemView = require('../modelViews/taskViews/taskListItemView.js');

var TaskCollectionView = Canto.View.extend({
  tagName              : 'ul',
  className            : 'task-list',
  template             : JST['collections/task'],

  // --------------------- //
  // Canto View Properties //
  // --------------------- //

  klass                : 'TaskCollectionView',
  family               : 'Canto.View',
  superFamily          : 'Backbone.View',

  types                : function() {
    return Canto.View.prototype.types().concat(['TaskCollectionView', 'TaskView']);
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  crossOff             : function(task) {
    if(!task.get('status') === 'Complete') { return; }

    var that = this, 
        view = this.retrieveViewForModel(task);

    view.$('a.task-title').css('text-decoration', 'line-through');

    setTimeout(function() {
      var index = that.childViews.indexOf(view);
      that.collection.remove(task);
      that.childViews.splice(index, 1);
    }, 750);
  },

  fetchCollection      : function() {
    this.collection.fetch();
  },

  removeBacklog        : function() {
    var backlog = this.collection.where({backlog: 'true'});
    this.collection.remove(backlog);
  },

  removeComplete       : function() {
    var complete = this.collection.where({status: 'Complete'});
    this.collection.remove(complete);
  },

  // ----------------- //
  // Special Functions //
  // ----------------- //

  removeChildViews     : function() {
    _.each(this.childViews, function(view) {
      view.remove();
      view.unbind();
    });
  },

  renderCollection     : function() {
    var that = this;

    this.collection.each(function(task) {
      var view = that.retrieveViewForModel(task) || new ListItemView({model: task});

      if (that.childViews.indexOf(view) <= -1) {
        that.childViews.push(view);
      }

      view.render();
      that.$el.append(view.$el);
    });
  },

  retrieveViewForModel : function(model) {
    if(!this.childViews.length) { return null; }

    var view = _.filter(this.childViews, function(view) {
      return view.model === model;
    });

    return view[0];
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize          : function(opts) {
    opts = opts || {};

    this.grouping     = opts.grouping;
    this.childViews   = [];
    this.quickAddForm = new QuickAddForm({collection: this.collection, grouping: this.grouping});

    this.listenTo(this.collection, 'add fetch', this.render);
    this.listenTo(this.collection, 'remove', this.removeChildAndRender);
    this.listenTo(this.collection, 'change:status', this.crossOff);

    // FIX: Determine whether this is really necessary
    // this.listenTo(this.quickAddForm, 'newTask', this.collection.fetch);
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

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.quickAddForm.render();
      that.$('li.quick-add-form').html(that.quickAddForm.$el);
      that.renderCollection();
    });
  }
});

module.exports = TaskCollectionView;