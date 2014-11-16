define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'css!stylesheets/canto.css',
  'text!templates/partials/kanban-board.html'
], function($, _, Backbone, API, CantoStyles, Template) {
  var KanbanBoardView = Backbone.View.extend({
    template   : _.template(Template),
    initialize : function() {
      // Don't render
    },

    render     : function() {
      this.$el.html(this.template());
      console.log(this.el);
      return this;
    }
  });

  return KanbanBoardView;
});