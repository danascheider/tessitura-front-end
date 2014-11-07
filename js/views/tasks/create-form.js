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

      this.collection.promiseCreate(attrs).then(function(model) {
        console.log('This is running');
        that.collection.fetch({
          url  : API.users.filter(that.collection.owner.get('id')),
          type : 'POST', 
          data : JSON.stringify({resource: 'Task', scope: 'incomplete'}),
          beforeSend : function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
          }, 
          success: function(collection, status, xhr) {
            console.log('Success');
          },
          error : function(collection, status, xhr) {
            console.log('Error');
          }
        });
      }, function(model) {
        console.log('Error: ', model);
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