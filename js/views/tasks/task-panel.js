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
      'mouseenter'          : 'showToggleWidgetIcon',
      'mouseleave'          : 'hideToggleWidgetIcon',
      'click .hide-widget'  : 'hideWidget',
      'click .show-widget'  : 'showWidget'
    },

    template : _.template(TaskPanelTemplate),

    hideToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeOut(100);
    },

    hideWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideUp();
      $(e.target).closest('span').removeClass('hide-widget').addClass('show-widget');
      $(e.target).removeClass('fa-minus').addClass('fa-plus');
    },

    renderContent: function() {
      if(this.collection) {
        this.$collectionView = new TaskCollectionView({ el: $(this.el).find('.panel-body'), 
                                                        collection: this.collection
                                                     });

        this.$collectionView.$el.find('ul').sortable();

      } else {
        var emptyPanel = new EmptyPanelView({el: $(this.el).find('.panel-body')});
        emptyPanel.render();
      }
    },

    showToggleWidgetIcon: function(e) {
      var span = $(e.target).closest('.dash-widget').find('span.hide-widget,span.show-widget').eq(0);
      span.fadeIn(100);
    },

    showTaskForm: function(e) {
      e.preventDefault();
      var target = e.target
      $(target).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
      $(target).siblings('.task-form').slideToggle();
    },

    showWidget: function(e) {
      $(e.target).closest('.dash-widget').find('div.panel-body').slideDown();
      $(e.target).closest('span').removeClass('show-widget').addClass('hide-widget');
      $(e.target).removeClass('fa-plus').addClass('fa-minus');
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