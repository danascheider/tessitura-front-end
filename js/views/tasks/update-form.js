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
    // FIX: el should be tagName
    el         : 'form',
    className  : 'edit-form',
    events     : {
      'submit .edit-form' : 'updateTask'
    }, 

    updateTask : function(e) {
      e.preventDefault();
      var form  = $(e.target);
      var that  = this;
      var attrs = Utils.getAttributes(form);

      this.model.set(attrs);

      this.model.save(attrs, {
        url        : API.tasks.single(that.model.get('id')),
        type       : 'PUT',
        beforeSend : Utils.authHeader,
        success    : function(model, response, xhr) {
          that.trigger('done');
        },
        error      : function(model, response, xhr) {
          console.log('Error: ', model);
        }
      });
    },

    render: function() {
      this.$el.closest('td').css('width', '97%');
      this.$el.closest('td').css('padding-right', '0.75em');
      this.$el.html(this.template({model: this.model}));
      return this;
    }
  });

  return TaskUpdateFormView;
});