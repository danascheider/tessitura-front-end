// Set globals
/* istanbul ignore next */ global.document  = window.document;
/* istanbul ignore next */ global.navigator = window.navigator;
/* istanbul ignore next */ global.$         = global.jQuery = require('jquery');
/* istanbul ignore next */ global._         = require('underscore');
/* istanbul ignore next */ global.Backbone  = require('backbone');
/* istanbul ignore next */ global.JST       = require('../templates/jst.js');

/* istanbul ignore next */ global.btoa      = function(string) {
  return new Buffer(string).toString('base64');
};

/* istanbul ignore next */ global.atob      = function(string) {
  return new Buffer(string, 'base64').toString('binary');
};

/* istanbul ignore next */ Backbone.$       = $;

// Basic requires that don't need references stored
/* istanbul ignore next */ require('jquery.cookie');
/* istanbul ignore next */ require('bootstrap-sass');
/* istanbul ignore next */ require('../vendor/jquery-ui-1.11.4.custom/jquery-ui.min.js');
/* istanbul ignore next */ require('../vendor/backbone-route-filter.js');
/* istanbul ignore next */ require('./views/backboneViewMods.js');
/* istanbul ignore next */ require('./collections/backboneCollectionMods.js');

/* istanbul ignore next */ global.Tessitura = {};

// Auxiliary Tessitura modules
Tessitura.API                    = require('./api.js');
Tessitura.Utils                  = require('./utils.js');

// Require models
Tessitura.Model                  = require('./models/tessituraModel.js');
Tessitura.ProtectedResourceModel = require('./models/protectedResourceModel.js');
Tessitura.TaskModel              = require('./models/taskModel.js');
Tessitura.UserModel              = require('./models/userModel.js');

// Require collections
Tessitura.ProtectedCollection   = require('./collections/protectedCollection.js');
Tessitura.TaskCollection        = require('./collections/taskCollection.js');

// Require top-level views
Tessitura.View                  = require('./views/appViews/tessituraView.js');
Tessitura.DashboardView         = require('./views/appViews/dashboardView.js');
Tessitura.HomepageView          = require('./views/appViews/homepageView.js');
Tessitura.DashWidgetView        = require('./views/appViews/dashWidgetView.js');


// Require model and collection views
Tessitura.QuickAddFormView      = require('./views/modelViews/taskViews/quickAddFormView.js');
Tessitura.TaskCreateFormView    = require('./views/modelViews/taskViews/taskCreateFormView.js');
Tessitura.TaskEditFormView      = require('./views/modelViews/taskViews/taskEditFormView.js');
Tessitura.TaskListItemView      = require('./views/modelViews/taskViews/taskListItemView.js');
Tessitura.UserModelView         = require('./views/modelViews/userViews/userModelView.js');
Tessitura.UserProfileView       = require('./views/modelViews/userViews/userProfileView.js');

// Require partial views
Tessitura.CalendarView           = require('./views/partialViews/calendarView.js');
Tessitura.DashboardHomeView      = require('./views/partialViews/dashboardHomeView.js');
Tessitura.DashboardNavView       = require('./views/partialViews/dashboardNavView.js');
Tessitura.DashboardProfileView   = require('./views/partialViews/dashboardProfileView.js');
Tessitura.DashboardSidebarView   = require('./views/partialViews/dashboardSidebarView.js');
Tessitura.DashboardTopWidgetView = require('./views/partialViews/dashboardTopWidgetView.js');
Tessitura.DashboardTaskView      = require('./views/partialViews/dashboardTaskView.js');
Tessitura.KanbanColumnView       = require('./views/partialViews/kanbanColumnView.js');
Tessitura.LoginFormView          = require('./views/partialViews/loginFormView.js');
Tessitura.RegistrationFormView   = require('./views/partialViews/registrationFormView.js');
Tessitura.TaskPanelView          = require('./views/partialViews/taskPanelView.js');

// Require presenters
Tessitura.AppPresenter           = require('./presenters/appPresenter.js');
Tessitura.DashboardPresenter     = require('./presenters/dashboardPresenter.js');

// Require router
Tessitura.Router                 = Tessitura.Router || require('./routers/tessituraRouter.js');