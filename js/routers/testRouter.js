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
    view = new Canto.TaskListItemView();
    view.render();
  },

  displayDashboardHomeView    : function() {
    view = new Canto.DashboardHomeView();
  },

  displayDashboardSidebarView : function() {
    view = new Canto.DashboardSidebarView();
    view.render();
  },

  displayDashboardTopWidgetView: function() {
    view = new Canto.DashboardTopWidgetView();
  },

  displayDashboardView        : function() {
    view = new Canto.DashboardView();
    view.render();
  },

  displayHomepageView         : function() {
    view = new Canto.HomepageView();
    view.render();
  },

  displayTaskCollectionView   : function() {
    view = new Canto.TaskCollectionView();
    view.render();
  },

  displayTaskPanelView        : function() {
    view = new Canto.TaskPanelView();
    view.render();
  }
});

module.exports = TestRouter;