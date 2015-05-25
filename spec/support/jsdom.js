var jsdom = require('jsdom');

global.document = jsdom.jsdom('<html><head><meta charset="utf8"></head><body></body></html>');
global.window   = document.defaultView;
global.window.$ = require('jquery');