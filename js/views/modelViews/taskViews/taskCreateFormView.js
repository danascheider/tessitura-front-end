Tessitura.TaskCreateFormView = Tessitura.View.extend({
  tagName       : 'form',
  id            : 'task-create-form',
  template      : JST['tasks/createForm'],

  events        : {
    'submit' : 'createTask'
  },

  createTask    : function(e) {
    e.preventDefault();

    var attributes = Tessitura.Utils.getAttributes(this.$el), that = this;
    
    if(!attributes.title) {
      this.$('input[name=title]').closest('.form-group').addClass('has-error');
      return;
    } else {

      // It is necessary to do it this way instead of using
      // `this.collection.create` because the latter triggers the `add` event
      // on the collection before the task is assigned an ID, which causes it
      // to be added to the view in `'li#task-undefined'`, which is obviously
      // wrong and aesthetically offensive.

      var task = new Tessitura.TaskModel();

      task.save(attributes, {
        success: function(task) {
          that.trigger('hideShade');
          that.collection.unshift(task);
        }
      });
    }
  },

  setCollection : function(collection) {
    this.collection = collection;
    return this;
  },
  
  render        : function() {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.TaskCreateFormView;