define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'jquery-ui',
  'api',
  'utils',
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
  JQueryUI,
  API,
  Utils,
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
      'click a.create-task' : 'toggleCreateForm',
    },

    // Event Handlers //
    createTask: function(e) {
      e.preventDefault();

      var that = this;
      var form = $('#quick-add-form');
      var attrs = Utils.getAttributes(form);

      if(!attrs.length) {
        form.find('div.form-group').addClass('has-error');
        form.find('input').attr('placeholder', 'Oops! Your new task needs a title!');
      }

      var newTask = (new TaskModel).save(attrs, {
        url        : API.tasks.collection($.cookie('userID')),
        beforeSend : Utils.authHeader,
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

      this.collection.each(function(task) {
        var view = new ListEntryView({modelTemplate: that.modelTemplate, model: task});
        var list = that.$el.find('ul');
        list.append(view.el);
      });

      return this;
    }
  });

  return TaskCollectionView;
});