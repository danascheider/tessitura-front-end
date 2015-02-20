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
      'click button:submit' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      var that = this;
      var form  = $(e.target).parent('form');
      var attrs = Utils.getAttributes(form);

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
      console.log(this.template());
      // this.$el.html(this.template());
      // this.delegateEvents();
      return this;
    }
  });

  return TaskCreateFormView;
});