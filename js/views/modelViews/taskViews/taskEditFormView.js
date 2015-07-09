Tessitura.TaskEditFormView = Tessitura.View.extend({
  tagName  : 'form',
  id       : 'task-edit-form',
  template : JST['tasks/editForm'],

  setModel : function(model) {
    this.model = model;
    return this;
  },

  render   : function() {
    return Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  },
});

module.exports = Tessitura.TaskEditFormView;