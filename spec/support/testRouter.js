require('../../js/dependencies.js');
var testing    = require('../../js/apiOptions.js').useTestRouter,
    TestRouter = Tessitura.Router.extend({});

if (testing) {
  Tessitura.DashboardHomeSpecView      = require('../../js/views/specViews/dashboardHomeSpecView.js');
  Tessitura.DashboardSidebarSpecView   = require('../../js/views/specViews/dashboardSidebarSpecView.js');
  Tessitura.DashboardTopWidgetSpecView = require('../../js/views/specViews/dashboardTopWidgetSpecView.js');
  Tessitura.DashboardSpecView          = require('../../js/views/specViews/dashboardSpecView.js');
  Tessitura.TaskListItemSpecView       = require('../../js/views/specViews/taskListItemSpecView.js');
  Tessitura.HomepageSpecView           = require('../../js/views/specViews/homepageSpecView.js');
  Tessitura.TaskCollectionSpecView     = require('../../js/views/specViews/taskCollectionSpecView.js');
  Tessitura.TaskPanelSpecView          = require('../../js/views/specViews/taskPanelSpecView.js');

  // Because adding these routes directly as the `routes` property of the test router
  // would overwrite, instead of adding to, the main Tessitura.Router routes, the 
  // routes are being defined here to combine the two sets. There is no need to 
  // define the route callbacks similarly, because the ones defined in the test router
  // have different names from those in the main router, and therefore do not
  // overwrite the prototype callbacks.
  
  var testRoutes = _.extend(Tessitura.Router.prototype.routes, {
        'listItemViewSpec(/)'           : 'displayListItemView',
        'dashboardHomeViewSpec(/)'      : 'displayDashboardHomeView',
        'dashboardSidebarViewSpec(/)'   : 'displayDashboardSidebarView',
        'dashboardTopWidgetViewSpec(/)' : 'displayDashboardTopWidgetView',
        'dashboardViewSpec(/)'          : 'displayDashboardView',
        'homepageViewSpec(/)'           : 'displayHomepageView',
        'taskCollectionViewSpec(/)'     : 'displayTaskCollectionView',
        'taskPanelViewSpec(/)'          : 'displayTaskPanelView',
      });

  TestRouter = Tessitura.Router.extend({
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
      view = new Tessitura.TaskListItemSpecView();
      view.render();
    },

    displayDashboardHomeView    : function() {
      view = new Tessitura.DashboardHomeSpecView();
      view.render();
    },

    displayDashboardSidebarView : function() {
      view = new Tessitura.DashboardSidebarSpecView();
      view.render();
    },

    displayDashboardTopWidgetView: function() {
      view = new Tessitura.DashboardTopWidgetSpecView();
      view.render();
    },

    displayDashboardView        : function() {
      view = new Tessitura.DashboardSpecView();
      view.render();
    },

    displayHomepageView         : function() {
      view = new Tessitura.HomepageSpecView();
      view.render();
    },

    displayTaskCollectionView   : function() {
      view = new Tessitura.TaskCollectionSpecView();
      view.render();
    },

    displayTaskPanelView        : function() {
      view = new Tessitura.TaskPanelSpecView();
      view.render();
    }
  });
}

module.exports = TestRouter;