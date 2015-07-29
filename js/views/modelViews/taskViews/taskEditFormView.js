Tessitura.TaskEditFormView = Tessitura.View.extend({
  tagName    : 'form',
  id         : 'task-edit-form',
  template   : JST['tasks/editForm'],

  events     : {
    'click button' : 'updateTask',
    'submit'       : 'updateTask'
  },

  setModel   : function(model) {
    this.model = model;
    return this;
  },

  updateTask : function(e) {
    e.preventDefault();

    var attrs = Tessitura.Utils.getAttributes(this.$el);

    if (!attrs.title) {
      this.$('input[name=title]').closest('.form-group').addClass('has-error');
      return;
    } else {
      var that = this;

      this.model.save(attrs, {
        success: function() {
          that.trigger('hideShade');
        }
      });
    }
  },

  render     : function() {
    return Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  },
});

module.exports = Tessitura.TaskEditFormView;