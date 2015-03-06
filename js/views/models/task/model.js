define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html'
  ], function($, _, Backbone, TaskModelTemplate) {

  var TaskModelView = Backbone.View.extend({
    className  : 'task-model',
    template   : _.template(TaskModelTemplate),

    events     : {
      'dblclick td[data-fieldname]' : 'showInput'
    },

    // --------------- //
    // Event Callbacks //
    // --------------- //

    renderOnSync : function() {
      if(this.model.get('status') === 'Complete') { return; }
      this.render();
    },

    showInput    : function(e) {
      var target = $(e.target).closest('td');
      var form   = target.find('span:has(input.quick-edit)');
      target.find('span.task-data').hide();
      form.children().show();
      form.find('input').focus();
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