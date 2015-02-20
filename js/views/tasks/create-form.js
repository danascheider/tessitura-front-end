define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'api',
  'models/task',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, Utils, API, TaskModel, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    tagName  : 'form',
    className: 'task-form',
    role     : 'form',

    events   : {
      'submit' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      var form  = this.$el;
      var attrs = Utils.getAttributes();

      this.collection.create(attrs, {
        url: API.tasks.collection($.cookie('userID')),
        success: function(model) {
          form.slideUp();
        },
        error: function(model, response) {
          console.log('Error: ', response);
        }
      });
    },

    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  return TaskCreateFormView;
});