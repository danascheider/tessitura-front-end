// Since Travis requires special treatment in the test environment, 
// its is configured to replace /spec/support/env.js with this file 
// before each build.

global.jsdom = require(process.cwd() + '/spec/support/jsdom.js');
global.btoa  = function(string) {
  return new Buffer(string).toString('base64');
};

// Only run Travis-friendly specs here. Specs that use Selenium will
// break the build, so only specs with the #travis tag will run there.

require('jasmine-tagged');
var jasmineEnv = jasmine.getEnv();
jasmineEnv.setIncludedTags(['travis']);
jasmineEnv.includeSpecsWithoutTags(false);