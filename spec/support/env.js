global.jsdom    = require(process.cwd() + '/spec/support/jsdom.js');
global.btoa     = function(string) {
  return new Buffer(string).toString('base64');
};

global.subsetOf = function(subset, superset) {
  var _ = require('underscore');
  _.each(subset, function(item) {
    if(!(superset.indexOf(item) > -1)) { return false; }
  });
};