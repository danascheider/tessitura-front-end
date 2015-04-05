global.document  = window.document;
global.navigator = window.navigator;

global.Canto     = {
  API      : require('./api.js'),
  Utils    : require('./utils.js'),
};

global.$ = global.jQuery = require('jquery');

global._        = require('underscore');
global.Backbone = require('backbone');
global.JST      = require('../templates/jst.js');
global.btoa     = function(string) {
  return new Buffer(string).toString('base64');
};
Backbone.$      = $;


require('jquery.cookie');
require('../vendor/jquery-ui-1.11.4.custom/jquery-ui.min.js');

module.exports = Canto;