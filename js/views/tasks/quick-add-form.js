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

            // The collection needs to be synced before being re-rendered;
            // otherwise, the new model won't show up properly. Consequently,
            // the `add` event is done silently and the collection renders as
            // each task is `fetch`ed.

            _.each(that.collection.models, function(model) {
              model.set('position', model.get('position' + 1));
            });

            that.collection.add(model);
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