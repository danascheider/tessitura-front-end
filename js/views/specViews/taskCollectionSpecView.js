Canto = Canto || require('../../dependencies');

var TaskModel      = require('../../models/taskModel.js'),
    Collection     = require('../../collections/taskCollection.js'),
    TaskPanel      = require('../partialViews/taskPanelView.js'),
    CollectionView = require('../collectionViews/taskCollectionView.js');

// Instantiate tasks to be displayed in view

var task1      = new TaskModel({id: 1, title: 'Task 1', status: 'New', priority: 'Normal', position: 1}),
    task2      = new TaskModel({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}),
    task3      = new TaskModel({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3}),
    collection = new Collection([task1, task2, task3]);

var SpecWrapper = Backbone.View.extend({
  el                     : 'body',
  template               : JST['spec/collection'],

  events                 : {
    'click a[data-method=crossOffIncomplete]' : 'callCrossOffIncomplete',
    'click a[data-method=crossOffComplete]'   : 'callCrossOffComplete',
    'click a[data-method=reset]'              : 'resetCollection'
  },

  callCrossOffIncomplete : function(e) {
    e.preventDefault();
    this.view.crossOff(task1);
  },

  callCrossOffComplete   : function(e) {
    e.preventDefault();
    this.view.crossOff(task3);
  },

  resetCollection        : function(e) {
    e.preventDefault();
    task1.set({title: 'Task 1', status: 'New', priority: 'Normal', position: 1});
    task2.set({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    task3.set({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});
    this.collection.reset([task1, task2, task3]);
  },

  initialize             : function() {
    this.view = new CollectionView({collection: collection});
    this.render();
  },

  render                 : function() {
    this.$el.html(this.template());
    this.delegateEvents();
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.view.delegateEvents();

    return this;
  }
});

module.exports = SpecWrapper;