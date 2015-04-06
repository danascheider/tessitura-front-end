Canto = Canto || require('../dependencies.js');
Canto.Router = Canto.Router || require('./cantoRouter.js');

var HomepageView         = require('../views/specViews/homepageSpecView.js'),
    ListItemView         = require('../views/specViews/taskListItemSpecView.js'),
    DashboardHomeView    = require('../views/specViews/dashboardHomeSpecView.js'),
    DashboardView        = require('../views/specViews/dashboardSpecView.js'),
    DashboardSidebarView = require('../views/specViews/dashboardSidebarSpecView.js'),
    TaskCollectionView   = require('../views/specViews/taskCollectionSpecView.js'),
    TaskPanelView        = require('../views/specViews/taskPanelSpecView.js'),
    TopWidgetView        = require('../views/specViews/dashboardTopWidgetSpecView.js');

var TestRouter = Canto.Router.extend({
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