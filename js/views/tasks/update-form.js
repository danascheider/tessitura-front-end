define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/update-form.html'
  ], function($, _, Backbone, UpdateFormTemplate) {

  var TaskUpdateFormView = Backbone.View.extend({
    template : _.template(UpdateFormTemplate),
    el       : 'form',

    render: function() {
      this.$el.html(this.template({model: this.model}));
      return this;
    }
  });

  return TaskUpdateFormView;
});