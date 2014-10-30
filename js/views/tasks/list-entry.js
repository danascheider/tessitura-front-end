define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
], function($, _, Backbone, TaskModelTemplate, ListEntryTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName  : 'tr',
    template : _.template(ListEntryTemplate),
    events   : {
      'click .fa-square-o' : 'markComplete'
    },

    modelTemplate: _.template(TaskModelTemplate),

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
          $(el).fadeOut();
        },
        error: function(model, response, options) {
          console.log(response);
        }
      });
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({modelTemplate: this.modelTemplate, model: this.model}));
      return this;
    }
  });

  return ListEntryView;
});