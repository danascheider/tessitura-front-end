Tessitura = require('./dependencies.js');

// Require models
Tessitura.Model                  = require('./models/TessituraModel.js');
Tessitura.ProtectedResourceModel = require('./models/protectedResourceModel.js');
Tessitura.TaskModel              = require('./models/taskModel.js');
Tessitura.UserModel              = require('./models/userModel.js');

// Require collections
Tessitura.ProtectedCollection = require('./collections/protectedCollection.js');
Tessitura.TaskCollection      = require('./collections/taskCollection.js');

// Require top-level views
Tessitura.View                = require('./views/appViews/TessituraView.js');
Tessitura.DashboardView       = require('./views/appViews/dashboardView.js');
Tessitura.HomepageView        = require('./views/appViews/homepageView.js');

// Require model and collection views
Tessitura.TaskModelView       = require('./views/modelViews/taskViews/taskModelView.js');
Tessitura.QuickAddFormView    = require('./views/modelViews/taskViews/quickAddFormView.js');
Tessitura.TaskListItemView    = require('./views/modelViews/taskViews/taskListItemView.js');
Tessitura.TaskCollectionView  = require('./views/collectionViews/taskCollectionView.js');

// Require partial views
Tessitura.DashboardHomeView      = require('./views/partialViews/dashboardHomeView.js');
Tessitura.DashboardSidebarView   = require('./views/partialViews/dashboardSidebarView.js');
Tessitura.DashboardTopWidgetView = require('./views/partialViews/dashboardTopWidgetView.js');
Tessitura.DashboardTaskView      = require('./views/partialViews/dashboardTaskView.js');
Tessitura.KanbanColumnView       = require('./views/partialViews/kanbanColumnView.js');
Tessitura.LoginFormView          = require('./views/partialViews/loginFormView.js');
Tessitura.RegistrationFormView   = require('./views/partialViews/registrationFormView.js');
Tessitura.TaskPanelView          = require('./views/partialViews/taskPanelView.js');

// Require presenters
Tessitura.AppPresenter         = require('./presenters/appPresenter.js');
Tessitura.DashboardPresenter   = require('./presenters/dashboardPresenter.js');

// Require router
Tessitura.Router     = Tessitura.Router || require('./routers/TessituraRouter.js');
Tessitura.TestRouter = require('../spec/support/testRouter.js');