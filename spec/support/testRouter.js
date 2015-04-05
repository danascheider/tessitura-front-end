Canto = Canto || require('../../js/dependencies.js');

var HomepageView         = require('../../js/views/specViews/homepageSpecView.js'),
    ListItemView         = require('../../js/views/specViews/taskListItemSpecView.js'),
    DashboardHomeView    = require('../../js/views/specViews/dashboardHomeSpecView.js'),
    DashboardView        = require('../../js/views/specViews/dashboardSpecView.js'),
    DashboardSidebarView = require('../../js/views/specViews/dashboardSidebarSpecView.js'),
    TaskCollectionView   = require('../../js/views/specViews/taskCollectionSpecView.js'),
    TaskPanelView        = require('../../js/views/specViews/taskPanelSpecView.js'),
    TopWidgetView        = require('../../js/views/specViews/dashboardTopWidgetSpecView.js');

var TestRouter = Backbone.Router.extend({
  routes : {
    'listItemViewSpec(/)'           : 'displayListItemView',
    'dashboardHomeViewSpec(/)'      : 'displayDashboardHomeView',
    'dashboardSidebarViewSpec(/)'   : 'displayDashboardSidebarView',
    'dashboardTopWidgetViewSpec(/)' : 'displayDashboardTopWidgetView',
    'dashboardViewSpec(/)'          : 'displayDashboardView',
    'homepageViewSpec(/)'           : 'displayHomepageView',
    'taskCollectionViewSpec(/)'     : 'displayTaskCollectionView',
    'taskPanelViewSpec(/)'          : 'displayTaskPanelView',
  },

  displayListItemView         : function() {
    view = new ListItemView();
    view.render();
  },

  displayDashboardHomeView    : function() {
    view = new DashboardHomeView();
  },

  displayDashboardSidebarView : function() {
    view = new DashboardSidebarView();
    view.render();
  },

  displayDashboardTopWidgetView: function() {
    view = new TopWidgetView();
  },

  displayDashboardView        : function() {
    view = new DashboardView();
    view.render();
  },

  displayHomepageView         : function() {
    view = new HomepageView();
    view.render();
  },

  displayTaskCollectionView   : function() {
    view = new TaskCollectionView();
    view.render();
  },

  displayTaskPanelView        : function() {
    view = new TaskPanelView();
    view.render();
  }
});

module.exports = TestRouter;