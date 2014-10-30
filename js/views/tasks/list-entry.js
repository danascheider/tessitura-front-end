define([
  'jquery',
  'underscore',
  'backbone',
  'models/task-presenter',
  'text!templates/tasks/list-entry.html',
], function($, _, Backbone, TaskPresenter, ListEntryTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName  : 'tr',
    template : _.template(ListEntryTemplate),
    events   : {
      'click .fa-square-o' : 'markComplete'
    },

    markComplete: function(e) {
      var target = e.target;
      var el = this.el;

      this.model.save({status: 'Complete'}, {
        dataType: 'html',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(model, response, options) {
          $(target).removeClass('fa-square-o').addClass('fa-check-square-o');
        },
        error: function(model, response, options) {
          console.log(response);
        }
      });
    },

    initialize: function() {
      this.render();
      this.listenTo(this.model, 'change', this.render());
    },

    render: function() {
      var presenter = new TaskPresenter({model: this.model});
      this.$el.html(presenter.partial(this.template));
      return this;
    }
  });

  return ListEntryView;
});