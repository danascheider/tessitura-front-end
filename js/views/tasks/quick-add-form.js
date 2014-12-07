define([
  'jquery',
  'underscore',
  'backbone', 
  'cookie',
  'api',
  'utils',
  'models/task',
  'text!templates/tasks/quick-add-form.html'
], function($, _, Backbone, Cookie, API, Utils, TaskModel, Template) {
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
      var form  = $(e.target).closest('form');
      var attrs = Utils.getAttributes(form);

      var newTask = new TaskModel(attrs);

      if(!!attrs.title) {
        newTask.save(newTask.attrs, {
          url: API.tasks.collection($.cookie('userID')),
          beforeSend: Utils.authHeader,
          success: function(model) {
            form[0].reset();
            that.collection.add(model);
          },
          error: function(model, response) {
            console.log('Error: ', response);
          }
        });
      }
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