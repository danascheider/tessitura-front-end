define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
], function($, _, Backbone, API, TaskModelTemplate, ListEntryTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName  : 'tr',
    template : _.template(ListEntryTemplate),
    events   : {
      'click .fa-square-o' : 'markComplete'
    },

    modelTemplate: _.template(TaskModelTemplate),

    markComplete      : function(e) {
      var that = this;
      var li = this.$el
      var modelID = li.attr('id').match(/\d+/)[0];

      var markComplete = new Promise(function(resolve, reject) {
        that.model.save({status: 'Complete'}, {
          dataType    : 'html',
          type        : 'PUT',
          url         : API.tasks.single(modelID),
          beforeSend  : function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
          },
          success     : function(model, status, xhr) {
            resolve(that.model);
          },
          error       : function(xhr, status, object) {
            reject(object);
          }
        });
      });

      markComplete.then(function(task) {
        // Check the checkbox and add strikethrough to the task title
        that.$el.find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
        that.$el.find('.task-title > a').css('text-decoration', 'line-through');
        task.collection.remove(task);
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