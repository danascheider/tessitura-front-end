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
    className  : 'task-form create-form quick-add-form',

    events     : {
      'submit' : 'createTask'
    },

    createTask : function(e) {
      // Prevent browser from submitting the form and reloading the page
      e.preventDefault();

      // Declare variable `that` for use inside the Ajax code
      var that = this;
      var attrs = Utils.getAttributes(this.$el);

      // Make sure the task being created has the attribute(s) common to
      // this form's collection

      _.each(this.grouping, function(value, key) {
        attrs[key] = value;
      });

      // Set the position of the task to 1 by default and trigger
      // changePosition

      // Tasks are invalid without a title, so this method 
      // should not run if the title is not included in the attributes.

      if(!!attrs.title) {
        this.collection.create(attrs, {
          url        : API.tasks.collection($.cookie('userID')),
          success    : function(model) {
            that.$el[0].reset();
          }
        });
      }
    },

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize : function(opts) {
      opts = opts || {};
      this.grouping = opts.grouping;
    },

    render     : function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  return QuickAddFormView;
});