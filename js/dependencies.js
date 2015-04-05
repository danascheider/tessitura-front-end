require('jquery.cookie');

global.Canto   = {
  API      : require('./api.js')
};

global.$        = require('jquery');
global._        = require('underscore');
global.Backbone = require('backbone');

global.JST      = {
  'tasks/model'    : _.template(require('../templates/modelTemplates/taskTemplates/modelTemplate.js')),
  'tasks/listItem' : _.template(require('../templates/modelTemplates/taskTemplates/listItemTemplate.js')),
};