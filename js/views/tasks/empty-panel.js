define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/create-form',
  'text!templates/partials/empty-task-panel.html',
  ], function($, _, Backbone, CreateFormView, EmptyPanelTemplate) {
  
  var EmptyTaskPanelTemplate = Backbone.View.extend({
    el       : $('.panel-body'),

    template : _.template(EmptyPanelTemplate),

    render   : function() {
      this.$el.append(this.template());

      var createForm = new CreateFormView({el: this.$el});
      createForm.render();

      return this;
    }
  });

  return EmptyTaskPanelTemplate;
});