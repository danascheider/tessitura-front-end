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
    tagName    : 'li',
    className  : 'quick-add-form not-sortable',

    events     : {
      'submit' : 'createTask'
    },

    createTask : function(e) {
      // Prevent browser from submitting the form and reloading the page
      e.preventDefault();

      // Declare variable `that` for use inside the Ajax code
      var that = this;
      var form = this.$('form'), attrs = Utils.getAttributes(form);

      // Tasks are invalid without a title, so any this method 
      // should not run if the title is not included in the attributes.
      if(!!attrs.title) {
        var newTask = new TaskModel(attrs);

        newTask.save({}, {
          type       : 'POST',
          url        : API.tasks.collection($.cookie('userID')),
          beforeSend : Utils.authHeader,
          success    : function(model) {
            form[0].reset();

            // The task positions are also set on the server, so no need to
            // sync the whole collection.

            _.each(that.collection.models, function(model) {
              model.set('position', model.get('position' + 1));
            });

            that.collection.add(model);
          }
        });
      }
    },

    render     : function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  return QuickAddFormView;
});