define([
  'jquery', 
  'underscore', 
  'backbone',
  'views/tasks/model',
  'views/tasks/collection',
  'views/tasks/empty-panel',
  'text!templates/partials/task-panel.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _,
    Backbone,
    TaskModelView,
    TaskCollectionView,
    EmptyPanelView,
    TaskPanelTemplate,
    CreateFormTemplate,
    BootstrapStyles,
    DashboardStyles,
    CantoStyles,
    FAStyles) {

  var TaskPanelView = Backbone.View.extend({
    el       : $('#task-panel'),

    events   : {
      'click a.create-task' : 'showTaskForm',
      'mouseenter'          : 'showCloseWidgetIcon',
      'mouseleave'          : 'hideCloseWidgetIcon',
      'click .hide-widget'  : 'hideWidget'
    },

    template : _.template(TaskPanelTemplate),

    hideCloseWidgetIcon: function(e) {
      $(e.target).closest('.dash-widget').find('span.hide-widget').fadeOut();
    },

    hideWidget: function(e) {
      $(e.target).closest('.dash-widget').fadeOut(100);
    },

    renderContent: function() {
      if(this.collection) {
        var collectionView = new TaskCollectionView({ el: $(this.el).find('.panel-body'), 
                                                      collection: this.collection
                                                    });
      } else {
        var emptyPanel = new EmptyPanelView({el: $(this.el).find('.panel-body')});
        emptyPanel.render();
      }
    },

    showCloseWidgetIcon: function(e) {
      $(e.target).closest('.dash-widget').find('span.hide-widget').show();
    },

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    // Core View Functions //

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.renderContent();
      return this;
    }
  });

  return TaskPanelView;
});