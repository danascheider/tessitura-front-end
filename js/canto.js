require('./dependencies.js');
require('./utils.js');

// Require models
require('./models/cantoModel.js');
require('./models/protectedResourceModel.js');
require('./models/taskModel.js');
require('./models/userModel.js');

// Require collections
require('./collections/protectedCollection.js');
require('./collections/taskCollection.js');

// Require top-level views
require('./views/appViews/cantoView.js');
require('./views/appViews/dashboardView.js');
require('./views/appViews/homepageView.js');

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
require('./views/partialViews/taskPanelView.js');

// Require presenters
require('./presenters/appPresenter.js');
require('./presenters/dashboardPresenter.js');

// Require router
Canto.Router = Canto.Router || require('./router.js'); // require('../spec/support/testRouter.js');
global.Router = new Canto.Router();
Backbone.history.start();