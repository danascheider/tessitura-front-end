define([
  'jquery',
  'underscore',
  'backbone',
  'form-utils',
  'api',
  'models/task',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, FormUtils, API, TaskModel, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    events   : {
      'click button:submit' : 'createTask'
    },

    template : _.template(CreateFormTemplate),

    createTask: function(e) {
      e.preventDefault();
      var that = this;
      var form  = $(e.target).parent('form');
      var attrs = FormUtils.getAttributes(form);
      var newTask = new TaskModel(attrs);

      newTask.save(newTask.attrs, {
        dataType   : 'html',
        url        : API.tasks.collection($.cookie('userID')),
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          $('a.create-task').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
          that.trigger('ajaxSuccess');
          form[0].reset();
          form.slideUp();
        },
        error: function(model, xhr, options) {
          console.log('Error: ', model);
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

  return TaskCreateFormView
});