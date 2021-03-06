var _   = require('underscore');
var JST = {
  'calendar'                 : _.template(require('./partialTemplates/calendarTemplate.js')),
  'dashboard'                : _.template('<div id=\'shade\'></div>'),
  'collections/organization' : _.template(require('./collectionTemplates/organizationCollectionTemplate.js')),
  'collections/task'         : _.template('<li class=\'quick-add-form not-sortable\'></li>'),
  'orgs/listItem'            : _.template(require('./modelTemplates/organizationTemplates/organizationListItemTemplate.js')),
  'partials/dashHome'        : _.template(require('./partialTemplates/dashboardHomeTemplate.js')),
  'partials/dashLocal'       : _.template(require('./partialTemplates/dashboardLocalTemplate.js')),
  'partials/dashNav'         : _.template(require('./partialTemplates/dashboardNavTemplate.js')),
  'partials/dashTasks'       : _.template(require('./partialTemplates/dashboardTaskTemplate.js')),
  'partials/errorPanel'      : _.template(require('./partialTemplates/errorPanelTemplate.js')),
  'partials/kanbanCol'       : _.template(require('./partialTemplates/kanbanColumnTemplate.js')),
  'partials/profile'         : _.template(require('./partialTemplates/dashboardProfileTemplate.js')),
  'partials/sidebar'         : _.template(require('./partialTemplates/dashboardSidebarTemplate.js')),
  'partials/taskPanel'       : _.template(require('./partialTemplates/taskPanelTemplate.js')),
  'partials/topWidgets'      : _.template(require('./partialTemplates/dashboardTopWidgetTemplate.js')),
  'tasks/listItem'           : _.template(require('./modelTemplates/taskTemplates/taskListItemTemplate.js')),
  'tasks/createForm'         : _.template(require('./modelTemplates/taskTemplates/taskCreateFormTemplate.js')),
  'tasks/quickAdd'           : _.template(require('./modelTemplates/taskTemplates/quickAddFormTemplate.js')),
  'tasks/editForm'           : _.template(require('./modelTemplates/taskTemplates/taskEditFormTemplate.js')),
  'users/model'              : _.template(require('./modelTemplates/userTemplates/userModelTemplate.js')),
  'users/profile'            : _.template(require('./modelTemplates/userTemplates/userProfileTemplate.js')),
  'fachs/form'               : _.template(require('./modelTemplates/fachTemplates/fachFormTemplate.js')),
};

module.exports = JST;