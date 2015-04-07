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
require('./views/modelViews/taskViews/taskListItemView.js');
require('./views/modelViews/taskViews/taskModelView.js');
require('./views/modelViews/taskViews/quickAddFormView.js');
require('./views/collectionViews/taskCollectionView.js');

// Require partial views
require('./views/partialViews/dashboardHomeView.js');
require('./views/partialViews/dashboardSidebarView.js');
require('./views/partialViews/dashboardTopWidgetView.js');
require('./views/partialViews/dashboardTaskView.js');
require('./views/partialViews/kanbanColumnView.js');
require('./views/partialViews/loginFormView.js');
require('./views/partialViews/registrationFormView.js');
require('./views/partialViews/taskPanelView.js');

// Require presenters
require('./presenters/appPresenter.js');
require('./presenters/dashboardPresenter.js');

// Require router
Canto.Router     = Canto.Router || require('./routers/cantoRouter.js'); // require('../spec/support/testRouter.js');
Canto.TestRouter = require('./routers/testRouter.js');

// global.TestRouter = new Canto.TestRouter();
global.Router     = new Canto.Router();
Backbone.history.start();