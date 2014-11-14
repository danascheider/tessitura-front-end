define([
  'jquery',
  'underscore',
  'backbone',
  'api',
  'views/tasks/update-form',
  'views/tasks/model',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
], function($, _, Backbone, API, UpdateFormView, ModelView, TaskModelTemplate, ListEntryTemplate) {

  var ListEntryView = Backbone.View.extend({
    tagName  : 'li',
    id       : function() { return 'task-' + this.model.get('id'); },
    template : _.template(ListEntryTemplate),

    events   : {
      'click .fa-pencil'   : 'showEditForm',
      'click .fa-square-o' : 'markComplete',
      'click .fa-times'    : 'deleteTask',
      'click button:reset' : 'hideEditForm',
      'mouseenter'         : 'showEditIcons',
      'mouseleave'         : 'hideEditIcons'
    },

    modelTemplate: _.template(TaskModelTemplate),

    crossOff          : function() {
      // In this context, `this` apparently refers to the model
      var task = this;

      if(this.get('status') === 'Complete') {
        var collection = task.collection;
        var id = '#task-' + this.get('id');

        $(id).find('i.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
        $(id).find('.task-title').css('text-decoration', 'line-through');

        var removeFromCollection = function() {
          collection.remove(task);
        }

        window.setTimeout(removeFromCollection, 750);        
      }
    },

    deleteTask        : function() {
      var model = this.model;

      model.destroy({
        url: API.tasks.single(model.get('id')),
        type: 'DELETE',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        }
      });
    },

    hideEditForm      : function() {

      // Make sure edit/delete icons display again as normal once the edit
      // form is hidden.

      this.$modelView.render();
    },

    hideEditIcons     : function() {
      this.$el.find('span.edit-task').hide();
    },

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

    showEditForm      : function() {
      this.$editForm.render();
    },

    showEditIcons     : function() {
      this.$el.find('span.edit-task').show();
    },

    // Standard View Functions // 

    initialize: function() {
      this.render();
      this.model.on('change:status', this.crossOff);
      this.listenTo(this.$editForm, 'done', this.render);
    },

    render: function() {
      this.$el.html(this.template);

      var td = this.$el.find('td.task-listing');
      this.$editForm = new UpdateFormView({model: this.model, el: td});
      this.$modelView = new ModelView({model: this.model, el: td});

      this.$modelView.render({el: this.$el.find('td.task-listing')});
      return this;
    }
  });

  return ListEntryView;
});