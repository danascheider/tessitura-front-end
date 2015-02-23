define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'utils',
  'text!templates/tasks/update-form.html'
  ], function($, _, Backbone, API, Utils, UpdateFormTemplate) {

  var TaskUpdateFormView = Backbone.View.extend({
    template   : _.template(UpdateFormTemplate),
    tagName    : 'form',
    className  : 'edit-form',
    events     : {
      'submit' : 'updateTask',
    }, 

    updateTask : function(e) {
      e.preventDefault();
      var form  = $(e.target).closest('form'), attrs = Utils.getAttributes(form), that = this;
      this.model.save(attrs, {
        type       : 'PUT',
        error      : function(model, response) {
          console.log('Error: ', response);
        }
      });
    },

    render: function() {
      this.$el.html(this.template({model: this.model}));
      return this;
    }
  });

  return TaskUpdateFormView;
});