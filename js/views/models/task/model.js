define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    className  : 'task-model',
    template   : _.template(TaskModelTemplate),

    // --------------- //
    // Event Callbacks //
    // --------------- //

    renderOnSync : function() {
      if(this.model.get('status') === 'Complete') { return; }
      this.render();
    },

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize : function() {
      this.listenTo(this.model, 'sync', this.renderOnSync);
    },

    render     : function() {
      this.$el.html(this.template({model: this.model}));
      this.delegateEvents();
      return this;
    }
  });

  return TaskModelView;
});