var _ = require('underscore');

var JST = {
  'dashboard'          : _.template(require('./topLevelTemplates/dashboardTemplate.js')),
  'homepage'           : _.template(require('./topLevelTemplates/homepageTemplate.js')),
  'collections/task'   : _.template('<li class=\'quick-add-form not-sortable\'></li>'),
  'partials/dashHome'  : _.template(require('./partialTemplates/dashboardHomeTemplate.js')),
  'partials/dashTasks' : _.template(require('./partialTemplates/dashboardTaskTemplate.js')),
  'partials/kanbanCol' : _.template(require('./partialTemplates/kanbanColumnTemplate.js')),
  'partials/loginForm' : _.template(require('./partialTemplates/loginFormTemplate.js')),
  'partials/sidebar'   : _.template(require('./partialTemplates/dashboardSidebarTemplate.js')),
  'partials/taskPanel' : _.template(require('./partialTemplates/taskPanelTemplate.js')),
  'partials/topWidgets': _.template(require('./partialTemplates/dashboardTopWidgetTemplate.js')),
  'tasks/model'        : _.template(require('./modelTemplates/taskTemplates/modelTemplate.js')),
  'tasks/listItem'     : _.template(require('./modelTemplates/taskTemplates/listItemTemplate.js')),
  'tasks/quickAdd'     : _.template(require('./modelTemplates/taskTemplates/quickAddFormTemplate.js')),
  'spec/dashboard'     : _.template(require('./specTemplates/dashboardSpecTemplate.js')),
  'spec/dashHome'      : _.template(require('./specTemplates/dashboardHomeSpecTemplate.js')),
  'spec/dashTasks'     : _.template(require('./specTemplates/dashboardTaskSpecTemplate.js')),
  'spec/homepage'      : _.template(require('./specTemplates/homepageSpecTemplate.js')),
  'spec/listItem'      : _.template(require('./specTemplates/taskListItemSpecTemplate.js')),
  'spec/sidebar'       : _.template(require('./specTemplates/dashboardSidebarSpecTemplate.js')),
  'spec/collection'    : _.template(require('./specTemplates/taskCollectionSpecTemplate.js')),
  'spec/taskPanel'     : _.template(require('./specTemplates/taskPanelSpecTemplate.js')),
  'spec/topWidgets'    : _.template(require('./specTemplates/dashboardTopWidgetSpecTemplate.js'))
};

module.exports = JST;