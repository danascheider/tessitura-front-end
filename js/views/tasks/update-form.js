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
      'click button:submit' : 'updateTask',
    }, 

    updateTask : function(e) {
      e.preventDefault();
      var form  = $(e.target).closest('form');
      console.log(form);
      var that  = this;
      var attrs = Utils.getAttributes(form);

      this.model.set(attrs);

      this.model.save(attrs, {
        url        : API.tasks.single(that.model.get('id')),
        type       : 'PUT',
        beforeSend : Utils.authHeader,
        success    : function() {
          that.trigger('done');
        },
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