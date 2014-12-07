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
    events   : {
      'click button:submit' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      var that = this;
      var form  = $(e.target).parent('form');
      var attrs = Utils.getAttributes(form);

      var newTask = new TaskModel(attrs);
      newTask.save(newTask.attrs, {
        url: API.tasks.collection($.cookie('userID')),
        beforeSend: Utils.authHeader,
        success: function(model) {
          form.slideUp();
          that.collection.add(model);
        },
        error: function(model, response) {
          console.log('Error: ', response);
        }
      });
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template);
      return this;
    }
  });

  return TaskCreateFormView;
});