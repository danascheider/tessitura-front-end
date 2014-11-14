define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'form-utils',
  'models/task',
  'views/tasks/create-form',
  'views/tasks/list-entry',
  'views/tasks/quick-add-form',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
  'text!templates/tasks/collection.html',
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  API,
  FormUtils,
  TaskModel,
  CreateFormView,
  ListEntryView,
  QuickAddFormView,
  ModelTemplate, 
  ListEntryTemplate, 
  CollectionTemplate
) {
  
  var TaskCollectionView = Backbone.View.extend({

    // Templates //

    template           : _.template(CollectionTemplate),
    modelTemplate      : _.template(ModelTemplate),
    listItemTemplate   : _.template(ListEntryTemplate),

    // Events //

    events : {
      'click th.task-title' : 'toggleTaskDetails',
      'click a.create-task' : 'toggleCreateForm',
    },

    // Event Handlers //
    createTask: function(e) {
      e.preventDefault();
      console.log('submit #quick-add-form was triggered');

      var that = this;
      var form = $('#quick-add-form');
      var attrs = FormUtils.getAttributes(form);

      if(!attrs.length) {
        form.find('div.form-group').addClass('has-error');
        form.find('input').attr('placeholder', 'Oops! Your new task needs a title!');
      }

      var newTask = (new TaskModel).save(attrs, {
        url        : API.tasks.collection($.cookie('userID')),
        beforeSend : function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success    : function(model, response, xhr) {
          that.collection.add(model);
          form.clear;
        },
        error      : function(model, response, xhr) {
          console.log('Error: ', response);
        }
      });
    },

    toggleCreateForm  : function(e) {
      e.preventDefault();
      var form = this.$el.find('form.task-form');
      $(form).slideToggle();
    },

    toggleTaskDetails : function(e) {
      e.preventDefault();
      var target = e.target;
      var siblings = $(target).closest('tr').siblings();
      $(siblings).toggle();
    },
    
    // Core View Functions //

    initialize: function() {
      this.render();
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'add', this.render);
    },

    render: function() {
      this.$el.html(this.template({ 
                                    collection: this.collection,
                                    listItemTemplate: this.listItemTemplate,
                                    modelTemplate: this.modelTemplate
                                  }));

      this.$quickAddForm = new QuickAddFormView({collection: this.collection});
      this.$el.find('li#quick-add-form').html(this.$quickAddForm.el);

      var that = this;
      var i    = 0

      this.collection.each(function(task) {
        if(i < 10) {
          var view = new ListEntryView({modelTemplate: that.modelTemplate, model: task});
          var list = that.$el.find('ul');
          list.append(view.el);
          i++
        }
      });

      return this;
    }
  });

  return TaskCollectionView;
});