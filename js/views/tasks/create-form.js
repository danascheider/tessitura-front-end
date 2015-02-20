define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'api',
  'models/task',
  'text!templates/tasks/create-form.html',
  'cookie'
  ], function($, _, Backbone, Utils, API, TaskModel, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    tagName    : 'form',
    className  : 'task-form',

    template   : _.template(CreateFormTemplate),

    createTask : function(e) {
      e.preventDefault();

      var attrs = Utils.getAttributes(this.$el);
      this.collection.create(attrs, {
        url : API.tasks.collection($.cookie('userID'))
      });
    },

    initialize: function() {
      _.bindAll(this, 'createTask', 'render');
    },

    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  return TaskCreateFormView;
});