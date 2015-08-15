/* istanbul ignore next */ global.jsdom    = require(process.cwd() + '/spec/support/jsdom.js');
/* istanbul ignore next */ global.btoa     = function(string) {
  return new Buffer(string).toString('base64');
};

/* istanbul ignore next */ global.subsetOf = function(subset, superset) {
  var _ = require('underscore');
  _.each(subset, function(item) {
    if(!(superset.indexOf(item) > -1)) { return false; }
  });
};

// require('jasmine-tagged');
// var jasmineEnv = jasmine.getEnv();
// jasmineEnv.setIncludedTags(['travis']);
// jasmineEnv.includeSpecsWithoutTags(false);