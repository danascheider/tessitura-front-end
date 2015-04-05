/*jshint node:true */
/*global process: false, module: true */
/**
 * Resolve base path to the JavaScript folder based on the current directory
 */

var jsSourcePath = require('path').resolve(process.cwd(), 'js');

/**
 * Loading the basic Require.js config (common.js) is a bit tricky: 
 * Obviously Require.js uses static code analysis to find the first
 * occurrence of `requirejs.config()`, so distinguishing config 
 * parameters for web and unit tests doesn't work like this:
 *
 * var options = { ? };
 * requirejs.config(options);
 *
 * So instead, we create a temporary global `requirejs` with a `config`
 * function, which captures the configuration values in `requirejsConfig`.
 */

var requirejsConfig = {};
requirejs = {
  config: function(options) {
    'use strict';
    requirejsConfig = options;
  }
};

/**
 * Now we load the config file `common.js` into Node.js, which directly
 * executes `requirejs.config`. Afterwards, the global `requirejs` is
 * no longer needed and immediately removed, so it doesn't collide with
 * Require.js calls afterwards.
 */

require(jsSourcePath + '/app/modules/common.js');
requirejs = null;

/**
 * Set the required additional settings for the test to work
 */

requirejsConfig.baseUrl = jsSourcePath;
requirejsConfig.suppress = { nodeShim: true };
requirejsConfig.nodeRequire = require;

/**
 * Load the Require.js module itself and expose it to the unit tests with
 * all necessary config variables.
 */

module.exports = require('requirejs').config(requirejsConfig);