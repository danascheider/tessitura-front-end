define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'views/tasks/create-form',
  'text!templates/tasks/model.html',
  'text!templates/tasks/list-entry.html',
  'text!templates/tasks/collection.html',
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  CreateFormView,
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
      'click .fa-square-o'  : 'markComplete',
      'click th.task-title' : 'toggleTaskDetails',
      'click a.create-task' : 'toggleCreateForm'
    },

    // Event Handlers //

    markComplete      : function(e) {
      var that = this;
      var target = e.target;
      var tableRow = $(target).parent('td').parent('tr');
      var modelID = $(tableRow).attr('id').match(/\d+/)[0];
      this.collection.get(modelID).save({status: 'Complete'}, {
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(model, status, xhr) {
          $(target).removeClass('fa-square-o').addClass('fa-check-square-o');
        }
      });
    },

    toggleCreateForm  : function(e) {
      e.preventDefault();
      var form = $(this.el).find('form.task-form');
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
      this.listenTo(this.$createForm, 'ajaxSuccess', this.render);
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template({ collection: this.collection,
                                    listItemTemplate: this.listItemTemplate,
                                    modelTemplate: this.modelTemplate
                                  }));
      this.$createForm = new CreateFormView({el: $(this.el).find('li.widget-create-form')});
      return this;
    }
  });

  return TaskCollectionView;
});