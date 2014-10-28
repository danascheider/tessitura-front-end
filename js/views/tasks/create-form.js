define([
  'jquery',
  'underscore',
  'backbone',
  'extras',
  'api',
  'models/task',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, Extras, API, TaskModel, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    events   : {
      'click button:submit' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      var form  = $(e.target).parent('form');
      var attrs = Extras.getAttributes(form);
      
      var newTask = new TaskModel(attrs);

      newTask.save(newTask.attrs, {
        dataType: 'html',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          $('a.create-task').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
          form[0].reset();
          form.slideUp();
        },
        error: function(model, xhr, options) {
          console.log('Error: ', model);
        }
      });
    },

    render: function() {
      this.$el.append(this.template);
      return this;
    }
  });

  return TaskCreateFormView
});