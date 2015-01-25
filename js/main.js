requirejs.config({
  paths: {
    jquery        : './lib/jquery-2.1.1',
    underscore    : './lib/underscore',
    backbone      : './lib/backbone',
    mocha         : './lib/mocha/mocha',
    chai          : './lib/chai/chai',
    sinon         : './lib/sinon-1.12.1',
    cookie        : './lib/cookie',
    filter        : './lib/backbone-route-filter-min',
    bootstrap     : './lib/bootstrap',
    text          : './lib/text',
    css           : './lib/css.min',
    templates     : '../templates',
    stylesheets   : '../css',
    'fa-styles'   : '../font-awesome/css',
    'jquery-ui'   : './lib/jquery-ui',
    'chai-jquery' : './lib/chai-jquery',
    'sinon-chai'  : './lib/sinon-chai'
  },

  shim: {
    bootstrap  : ['jquery'],
    'backbone' : {
      deps     : ['jquery', 'underscore'],
      exports  : 'Backbone'
    },
    'chai-jquery' : ['jquery', 'chai'],
    'sinon-chai'  : ['chai', 'sinon']
  }
});

require(['backbone', 'router', 'models/user', 'cookie'], function(Backbone, Router, UserModel) {
  $(function() {

    // FIX: Call to window.user is probably not a good idea when using Require.js
    
    if($.cookie('auth') && $.cookie('userID')) {
      window.user = new UserModel({id: $.cookie('userID')});
    }
    
    this.router = new Router();
    Backbone.history.start({root: '.'});
  });
});