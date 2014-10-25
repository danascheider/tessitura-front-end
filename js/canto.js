define([
  'jquery', 
  'underscore',
  'cookie', 
  'backbone', 
  'router', 
  'models/session',
  'bootstrap',
  'extras',
  ], function($, _, Cookie, Backbone, Router, Session, Bootstrap, SBAdmin, Extras) {

  return {
    initialize: function() {
      this.router = new Router;
      Backbone.history.start();
    },

    start: function() {
      this.Session = new Session;

      if(this.Session.authenticated()) {
        Backbone.history.navigate('dashboard', {trigger: true});
      }
    }
  };
});