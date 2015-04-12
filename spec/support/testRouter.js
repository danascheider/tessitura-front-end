require('../../js/dependencies.js');
var testing    = require('../../js/apiOptions.js').test;
var TestRouter = Canto.Router.extend({});

if (testing) {
  Canto.DashboardHomeSpecView      = require('../../js/views/specViews/dashboardHomeSpecView.js');
  Canto.DashboardSidebarSpecView   = require('../../js/views/specViews/dashboardSidebarSpecView.js');
  Canto.DashboardTopWidgetSpecView = require('../../js/views/specViews/dashboardTopWidgetSpecView.js');
  Canto.DashboardSpecView          = require('../../js/views/specViews/dashboardSpecView.js');
  Canto.TaskListItemSpecView       = require('../../js/views/specViews/taskListItemSpecView.js');
  Canto.HomepageSpecView           = require('../../js/views/specViews/homepageSpecView.js');
  Canto.TaskCollectionSpecView     = require('../../js/views/specViews/taskCollectionSpecView.js');
  Canto.TaskPanelSpecView          = require('../../js/views/specViews/taskPanelSpecView.js');

  TestRouter = Canto.Router.extend({
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
      view = new Canto.TaskListItemSpecView();
      view.render();
    },

    displayDashboardHomeView    : function() {
      view = new Canto.DashboardHomeSpecView();
    },

    displayDashboardSidebarView : function() {
      view = new Canto.DashboardSidebarSpecView();
      view.render();
    },

    displayDashboardTopWidgetView: function() {
      view = new Canto.DashboardTopWidgetSpecView();
    },

    displayDashboardView        : function() {
      view = new Canto.DashboardSpecView();
      view.render();
    },

    displayHomepageView         : function() {
      view = new Canto.HomepageSpecView();
      view.render();
    },

    displayTaskCollectionView   : function() {
      view = new Canto.TaskCollectionSpecView();
      view.render();
    },

    displayTaskPanelView        : function() {
      view = new Canto.TaskPanelSpecView();
      view.render();
    }
  });
}

module.exports = TestRouter;