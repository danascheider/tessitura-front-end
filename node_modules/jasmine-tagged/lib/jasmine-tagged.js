(function() {
  var env, findTags, includeSpecsWithoutTags, includedTags, jasmine, originalFilter;

  jasmine = require('jasmine-focused');

  env = jasmine.getEnv();

  includeSpecsWithoutTags = true;

  env.includeSpecsWithoutTags = function(permit) {
    return includeSpecsWithoutTags = permit;
  };

  includedTags = [];

  env.setIncludedTags = function(tags) {
    return includedTags = tags;
  };

  findTags = function(spec) {
    var parent, tags, word, words, _ref;
    words = spec.description.split(' ');
    tags = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        if (word.indexOf('#') === 0) {
          _results.push(word.substring(1));
        }
      }
      return _results;
    })();
    if (tags == null) {
      tags = [];
    }
    if (parent = (_ref = spec.parentSuite) != null ? _ref : spec.suite) {
      return tags.concat(findTags(parent));
    } else {
      return tags;
    }
  };

  originalFilter = env.specFilter ? env.specFilter : function() {
    return true;
  };

  env.specFilter = function(spec) {
    var tags;
    if (!originalFilter(spec)) {
      return false;
    }
    tags = findTags(spec);
    if (includeSpecsWithoutTags && tags.length === 0) {
      return true;
    }
    if (tags.some(function(t) {
      return includedTags.some(function(it) {
        return it === t;
      });
    })) {
      return true;
    } else {
      return false;
    }
  };

  module.exports = jasmine;

}).call(this);
