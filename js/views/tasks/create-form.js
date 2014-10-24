define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    events   : {
      'submit form' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      console.log('Nice try!');
    },

    render: function() {
      this.$el.append(this.template);
      return this;
    }
  });

  return TaskCreateFormView
});