var TaskModelView = Tessitura.View.extend({
  tagName      : 'div',
  className    : 'task-model',
  template     : JST['tasks/model'],

  /* Tessitura View Attributes
  /**************************************************************************************/

  klass        : 'TaskModelView',
  family       : 'Tessitura.View',
  superFamily  : 'Backbone.View',
  types        : function() {
    return Tessitura.View.prototype.types().concat('TaskModelView');
  },

  /* Event Callbacks
  /**************************************************************************************/

  renderOnSync : function() {
    if(this.model.get('status') === 'Complete') { return; }
    this.render();
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize   : function() {
    this.listenTo(this.model, 'sync', this.renderOnSync);
  },

  render       : function() {
    return Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  }
});

module.exports = TaskModelView;