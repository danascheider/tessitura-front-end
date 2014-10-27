define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/model',
  'text!templates/tasks/list-entry.html',
  'text!templates/tasks/model.html'
], function($, _, Backbone, TaskView, ListEntryTemplate, TaskModelTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template(ListEntryTemplate),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template(this.model.attributes));
      return this;
    }
  });

  return ListEntryView;
});