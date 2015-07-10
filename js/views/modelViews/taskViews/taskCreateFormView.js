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
      that.collection.create(attributes, {
        success: function() {
          that.trigger('hideShade');
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