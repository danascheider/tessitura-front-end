/* istanbul ignore next */ var _ = require('underscore');

/* istanbul ignore next */
var JST = {
  'calendar'           : _.template(require('./partialTemplates/calendarTemplate.js')),
  'dashboard'          : _.template('<div id=\'shade\'></div>'),
  'homepage'           : _.template(require('./topLevelTemplates/homepageTemplate.js')),
  'collections/task'   : _.template('<li class=\'quick-add-form not-sortable\'></li>'),
  'partials/dashHome'  : _.template(require('./partialTemplates/dashboardHomeTemplate.js')),
  'partials/dashNav'   : _.template(require('./partialTemplates/dashboardNavTemplate.js')),
  'partials/dashTasks' : _.template(require('./partialTemplates/dashboardTaskTemplate.js')),
  'partials/kanbanCol' : _.template(require('./partialTemplates/kanbanColumnTemplate.js')),
  'partials/loginForm' : _.template(require('./partialTemplates/loginFormTemplate.js')),
  'partials/profile'   : _.template(require('./partialTemplates/dashboardProfileTemplate.js')),
  'partials/sidebar'   : _.template(require('./partialTemplates/dashboardSidebarTemplate.js')),
  'partials/regForm'   : _.template(require('./partialTemplates/registrationFormTemplate.js')),
  'partials/taskPanel' : _.template(require('./partialTemplates/taskPanelTemplate.js')),
  'partials/topWidgets': _.template(require('./partialTemplates/dashboardTopWidgetTemplate.js')),
  'tasks/listItem'     : _.template(require('./modelTemplates/taskTemplates/taskListItemTemplate.js')),
  'tasks/quickAdd'     : _.template(require('./modelTemplates/taskTemplates/quickAddFormTemplate.js')),
  'tasks/editForm'     : _.template(require('./modelTemplates/taskTemplates/taskEditFormTemplate.js')),
  'users/model'        : _.template(require('./modelTemplates/userTemplates/userModelTemplate.js')),
  'users/profile'      : _.template(require('./modelTemplates/userTemplates/userProfileTemplate.js')),
};

/* istanbul ignore next */ module.exports = JST;