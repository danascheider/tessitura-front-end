define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
], function($, _, Backbone, API, TaskModelTemplate, ListEntryTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName  : 'li',
    template : _.template(ListEntryTemplate),
    events   : {
      'click .fa-square-o' : 'markComplete'
    },

    modelTemplate: _.template(TaskModelTemplate),

    markComplete      : function(e) {
      var that    = this;
      var li      = this.$el
      var target  = e.target;

      this.model.save({status: 'Complete'}, {
        dataType    : 'html',
        type        : 'PUT',
        url         : API.tasks.single(this.model.get('id')),
        beforeSend  : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        }
      });
    },

    crossOff : function() {
      // In this context, `this` apparently refers to the model
      var task = this;
      var collection = task.collection;
      var id = '#task-' + this.get('id');
      var title = $(id).find('.task-title');
      var i = $(id).find('i.fa-square-o');

      i.removeClass('fa-square-o').addClass('fa-check-square-o');
      title.css('text-decoration', 'line-through');
      var removeFromCollection = function() {
        collection.remove(task);
      }

      window.setTimeout(removeFromCollection, 750);
    },

    removeFromCollection: function() {
      console.log(this);
      console.log(this.collection);
      this.collection.remove(this);
    },

    initialize: function() {
      this.render();
      this.model.on('change:status', this.crossOff);
    },

    render: function() {
      this.$el.html(this.template({modelTemplate: this.modelTemplate, model: this.model}));
      return this;
    }
  });

  return ListEntryView;
});