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

// /* istanbul ignore next */ require('jasmine-tagged');
// /* istanbul ignore next */ var jasmineEnv = jasmine.getEnv();
// /* istanbul ignore next */ jasmineEnv.setIncludedTags(['travis']);
// /* istanbul ignore next */ jasmineEnv.includeSpecsWithoutTags(false);