Canto      = Canto || require('../../../dependencies.js');
Canto.View  = Canto.View || require('../../appViews/cantoView.js');

var TaskModel  = require('../../../models/taskModel.js');

var TaskModelView = Canto.View.extend({
  tagName      : 'div',
  className    : 'task-model',
  template     : JST['tasks/model'],

  // --------------------- //
  // Canto View Attributes //
  // --------------------- //

  klass        : 'TaskModelView',
  family       : 'Canto.View',
  superFamily  : 'Backbone.View',
  types        : function() {
    return Canto.View.prototype.types().concat('TaskModelView');
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  renderOnSync : function() {
    if(this.model.get('status') === 'Complete') { return; }
    this.render();
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize   : function() {
    this.listenTo(this.model, 'sync', this.renderOnSync);
  },

  render       : function() {
    return Canto.View.prototype.render.call(this, this.template({model: this.model}));
  }
});

module.exports = TaskModelView;