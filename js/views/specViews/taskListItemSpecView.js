Canto = Canto || require('../../dependencies.js');

var View = require('../modelViews/taskViews/taskListItemView.js');
var Task = require('../../models/taskModel.js');

var task = new Task({id: 1, title: 'Make tests for the SpecWrapper views'});

var SpecWrapper = Backbone.View.extend({
  el         : 'body',
  template   : JST['spec/listItem'],

  events     : {
    'click a' : 'callMethod'
  },

  callMethod : function(e) {
    e.preventDefault();
    this.view[$(e.target).attr('data-method')]();
  },

  initialize : function() {
    this.view = new View({model: task});
  },

  render     : function() {
    this.$el.html(this.template());
    this.view.render();
    this.$('#view').html(this.view.el);
  }
});

module.exports = SpecWrapper;