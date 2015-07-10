Tessitura.TaskCreateFormView = Tessitura.View.extend({
  tagName       : 'form',
  id            : 'task-create-form',
  template      : JST['tasks/createForm'],

  setCollection : function(collection) {
    this.collection = collection;
    return this;
  },
  
  render        : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.TaskCreateFormView;