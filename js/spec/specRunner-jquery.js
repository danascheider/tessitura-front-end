// Emulate the DOM for running jQuery
window = require('jsdom').jsdom().createWindow();
window.jQuery = jQuery = window.$ = $ = require(path.resolve(process.cwd(), 'lib/jquery-2.1.1.js'));