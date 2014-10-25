define([
  'jquery', 
  'underscore',
  'backbone', 
  'router', 
  'models/session',
  'bootstrap',
], function($, _, Backbone, Router, Session, Bootstrap) {

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