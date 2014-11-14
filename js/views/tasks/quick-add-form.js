define([
  'jquery',
  'underscore',
  'backbone', 
  'cookie',
  'api',
  'form-utils',
  'models/task',
  'text!templates/tasks/quick-add-form.html'
], function($, _, Backbone, Cookie, API, FormUtils, TaskModel, Template) {
  var QuickAddFormView = Backbone.View.extend({
    template   : _.template(Template),
    tagName    : 'form',
    className  : 'create-form',

    events     : {
      'submit' : 'createTask'
    },

    createTask : function(e) {
      e.preventDefault();
      
      var that = this;
      var form  = $(e.target);
      var attrs = FormUtils.getAttributes(form);

      var newTask = new TaskModel(attrs);
      
      newTask.save(newTask.attrs, {
        url: API.tasks.collection($.cookie('userID')),
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(model, response, options) {
          form.clear;
          that.collection.add(model);
        },
        error: function(model, response, options) {
          console.log('Error: ', response);
        }
      });
    },

    initialize : function() {
      this.render();
    },

    render     : function() {
      this.$el.html(this.template);
      return this;
    }
  });

  return QuickAddFormView;
});