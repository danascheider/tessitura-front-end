define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/create-form.html'
  ], function($, _, Backbone, CreateFormTemplate) {

  var TaskCreateFormView = Backbone.View.extend({
    el       : 'div.panel-body',
    template : _.template(CreateFormTemplate),

    render: function() {
      this.$el.append(compiledTemplate);
      return this;
    }
  });

  return TaskCreateFormView
});