Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var CollectionView = require('../collectionViews/taskCollectionView.js');

var TaskPanelView = Canto.View.extend({
  id                   : 'task-panel',
  className            : 'panel panel-primary dash-widget',
  template             : JST['partials/taskPanel'],

  events               : {
    'mouseenter'         : 'showToggleWidgetIcon',
    'mouseleave'         : 'hideToggleWidgetIcon',
    'click .hide-widget' : 'hideWidget',
    'click .show-widget' : 'showWidget'
  },

  // --------------------- //
  // Canto View Properties // 
  // --------------------- //

  klass                : 'TaskPanelView',

  types                : function() {
    return Canto.View.prototype.types().concat(['TaskPanelView', 'TaskPanel', 'TaskView', 'PartialView']);
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  crossOffComplete     : function() {
    var that = this;

    var complete = this.collection.where({status: 'Complete'});
    _.each(complete, function(task) {
      that.collectionView.crossOff(task);
    });
  },

  filterCollection     : function(collection) {
    var tasks = collection.models.filter(function(task) {
      return task.get('status') !== 'Blocking' && !task.get('backlog');
    });

    var slice = tasks.slice(0, 10);
    return slice;
  },

  hideToggleWidgetIcon : function() {
    if(this.$('span.show-widget i,span.hide-widget i').is(':visible')) { 
      this.$('span.show-widget i, span.hide-widget i').fadeOut(100);
    }
  },

  hideWidget           : function() {
    this.$('span.pull-right').removeClass('hide-widget').addClass('show-widget');
    this.$('i.fa-minus').removeClass('fa-minus').addClass('fa-plus');
    this.$('.panel-body').slideUp();
  },

  removeBacklogged     : function() {
    var that = this;
    var backlogged = this.collection.where({backlog: true});
   _.each(backlogged, function(task) { that.collection.remove(task); });
  },

  showToggleWidgetIcon : function() {
    if(!this.$('span.show-widget,span.hide-widget').is(':visible')) {
      this.$('span.show-widget, span.hide-widget').fadeIn(100);
    }
  },

  showWidget           : function() {
    this.$('span.pull-right').first().removeClass('show-widget').addClass('hide-widget');
    this.$('i.fa-plus').removeClass('fa-plus').addClass('fa-minus');
    this.$('.panel-body').slideDown();
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize           : function(opts) {
    opts = opts || {};

    _.extend(this, opts);

    this.collectionView = new CollectionView({collection: opts.collection});

    this.listenTo(this.collection, 'change:status', this.crossOffComplete);
    this.listenTo(this.collection, 'change:backlog', this.removeBacklogged);
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
      that.$el.sortable({
        items : '>*:not(.not-sortable)'
      });
    });
  }
});

module.exports = TaskPanelView;