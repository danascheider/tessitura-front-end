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

      var task = new TaskModel;

      // This horrible hack is required because, apparently,
      // this.collection.create doesn't wait for the server response
      // to add to the collection, even with {wait: true}. This way,
      // the view doesn't render until the server has responded with
      // the task's ID.

      // This should probably be re-implemented using promises
      
      task.save(attrs, {
        dataType   : 'html',
        url        : API.tasks.collection($.cookie('userID')),
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          $('a.create-task').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
          form[0].reset();
          form.slideUp();
        }
      }).done(function(data, status, xhr) {
        that.collection.add(data.attributes);
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