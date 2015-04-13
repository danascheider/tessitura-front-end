Canto = require('./dependencies.js');

// Require models
Canto.Model                  = require('./models/cantoModel.js');
Canto.ProtectedResourceModel = require('./models/protectedResourceModel.js');
Canto.TaskModel              = require('./models/taskModel.js');
Canto.UserModel              = require('./models/userModel.js');

// Require collections
Canto.ProtectedCollection = require('./collections/protectedCollection.js');
Canto.TaskCollection      = require('./collections/taskCollection.js');

// Require top-level views
Canto.View                = require('./views/appViews/cantoView.js');
Canto.DashboardView       = require('./views/appViews/dashboardView.js');
Canto.HomepageView        = require('./views/appViews/homepageView.js');

// Require model and collection views
Canto.TaskModelView       = require('./views/modelViews/taskViews/taskModelView.js');
Canto.QuickAddFormView    = require('./views/modelViews/taskViews/quickAddFormView.js');
Canto.TaskListItemView    = require('./views/modelViews/taskViews/taskListItemView.js');
Canto.TaskCollectionView  = require('./views/collectionViews/taskCollectionView.js');

// Require partial views
Canto.DashboardHomeView      = require('./views/partialViews/dashboardHomeView.js');
Canto.DashboardSidebarView   = require('./views/partialViews/dashboardSidebarView.js');
Canto.DashboardTopWidgetView = require('./views/partialViews/dashboardTopWidgetView.js');
Canto.DashboardTaskView      = require('./views/partialViews/dashboardTaskView.js');
Canto.KanbanColumnView       = require('./views/partialViews/kanbanColumnView.js');
Canto.LoginFormView          = require('./views/partialViews/loginFormView.js');
Canto.RegistrationFormView   = require('./views/partialViews/registrationFormView.js');
Canto.TaskPanelView          = require('./views/partialViews/taskPanelView.js');

// Require presenters
Canto.AppPresenter         = require('./presenters/appPresenter.js');
Canto.DashboardPresenter   = require('./presenters/dashboardPresenter.js');

// Require router
Canto.Router     = Canto.Router || require('./routers/cantoRouter.js'); // require('../spec/support/testRouter.js');
Canto.TestRouter = require('../spec/support/testRouter.js');

// global.TestRouter = new Canto.TestRouter();
global.Router     = new Canto.Router();
Backbone.history.start();