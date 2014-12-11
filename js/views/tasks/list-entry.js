define([
  'jquery',
  'underscore',
  'backbone',
  'jquery-ui',
  'api',
  'utils',
  'views/tasks/update-form',
  'views/tasks/model',
  'text!templates/tasks/list-entry.html',
], function(
  $, 
  _, 
  Backbone, 
  JQueryUI,
  API, 
  Utils, 
  UpdateFormView, 
  ModelView, 
  ListEntryTemplate
) {

  var ListEntryView = Backbone.View.extend({
    tagName   : 'li',
    id        : function() { return 'task-' + this.model.get('id'); },
    className : 'ui-widget-content ui-draggable ui-draggable-handle task-list-item',
    template  : _.template(ListEntryTemplate),

    events    : {
      'click .fa-pencil'   : 'showEditForm',
      'click .fa-square-o' : 'markComplete',
      'click .fa-times'    : 'deleteTask',
      'click .fa-archive'  : 'backlogTask',
      'click a.task-title' : 'toggleTaskDetails',
      'click button:reset' : 'hideEditForm',
      'mouseenter'         : 'showEditIcons',
      'mouseleave'         : 'hideEditIcons'
    },

    configureDraggable: function() {
      var that = this;

      this.$el.draggable({
        containment: 'parent',
        connectToSortable: '.task-list',

        // Start and stop functions should vary depending on what view
        // they are rendered in. 

        stop: function() {
          // FIX: Now that there is a multiple-update route, that can be 
          //      used more efficiently instead of making individual API
          //      calls for each task

          var column = $(this).closest('.kanban-col').find('.panel-heading')[0];

          // At this point, sorting only works on the dashboard. On
          // the Kanban board, tasks change status when dragged and 
          // dropped, but do not change their list position.
          
          if (!column) {
            // Check the order of the list
            var items = that.$el.closest('ul').find('li.task-list-item');
            var coll  = that.model.collection;

            // Incrementor
            var i = 1;
            
            $.each(items, function(index) {
              var modelID = $(items[index]).attr('id').match(/(\d+)/)[0];

              if (coll.get(modelID).get('position') !== i) {
                coll.get(modelID).save({position: i}, {
                  url        : API.tasks.single(modelID),
                  beforeSend : Utils.authHeader
                });
              }

              i++;
            });

          } else if (column.innerText === 'Backlog') {
            that.model.set('backlog', true);
          } else {
            that.model.set('status', column.innerText);
          }

          that.model.save({}, {
            dataType: 'html',
            url : API.tasks.single(that.model.get('id')),
            beforeSend: Utils.authHeader
          });
        }
      });
    },

    createChildViews: function() {
      this.$editForm = new UpdateFormView({model: this.model});
      this.$modelView = new ModelView({model: this.model});
    },

    // Event Handlers //

    backlogTask       : function() {
      this.model.save({backlog: true}, {
        dataType    : 'html',
        type        : 'PUT',
        url         : API.tasks.single(this.model.get('id')),
        beforeSend  : Utils.authHeader
      });
    },

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
        };

        window.setTimeout(removeFromCollection, 750);        
      }
    },

    deleteTask        : function() {
      var model = this.model;

      model.destroy({
        url: API.tasks.single(model.get('id')),
        type: 'DELETE',
        beforeSend: Utils.authHeader
      });
    },

    hideEditForm      : function() {
      var that = this;

      this.$editForm.$el.slideUp();
      this.$editForm.remove();

      window.setTimeout(function() {
        that.$modelView.render();
        that.$('td.task-listing').html(that.$modelView.el);
        that.$('span.edit-task').show();
        that.$('span.edit-task').css('visibility', 'hidden');
      }, 50);
    },

    hideEditIcons     : function() {
      this.$('span.edit-task').css('visibility', 'hidden');
    },

    markComplete      : function(e) {
      var that = this, li = this.$el;

      this.model.save({status: 'Complete'}, {
        dataType    : 'html',
        type        : 'PUT',
        url         : API.tasks.single(that.model.get('id')),
        beforeSend  : Utils.authHeader
      });
    },

    removeStyles      : function() {
      this.$el.removeAttr('style');
    },

    showEditForm      : function() {
      var td = this.$('td.task-listing');
      this.$('span.edit-task').fadeOut(150);

      var that = this;

      function renderForm() {
        that.$modelView.remove();

        td.css('width', '97%');
        td.css('padding-right', '0.75em');

        that.$editForm.render();
        td.html(that.$editForm.el);
      }

      window.setTimeout(renderForm, 150);
    },

    showEditIcons     : function() {
      if(!this.$('form').is(':visible')) {
        this.$('span.edit-task').css('visibility', 'visible');
      }
    },

    toggleTaskDetails : function(e) {
      e.preventDefault();
      var target = $(e.target);
      var table  = target.siblings('table');
      $(table).toggle();
    },

    // Standard View Functions // 

    initialize: function() {
      this.render();
      this.model.on('change:status', this.crossOff);
      this.listenTo(this.$editForm, 'done', this.render);
      this.listenTo(this.model, 'change:position', this.removeStyles);
    },

    render: function() {
      this.$el.html(this.template());

      this.createChildViews();

      this.$modelView.render();
      this.$('td.task-listing').html(this.$modelView.el);

      this.configureDraggable();

      return this;
    }
  });

  return ListEntryView;
});