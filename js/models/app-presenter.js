define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/app/homepage',
], function($, _, Backbone, UserModel, HomepageView) {

  var AppPresenter = Backbone.Model.extend({
    initialize : function() {
      this.homepageView  = new HomepageView();
      this.listenTo(this.homepageView, 'ajaxSuccess', this.emitLogin);
    },

    emitLogin   : function() {
      this.trigger('userLoggedIn');
    },

    getHomepage : function(element) {
      this.homepageView = this.homepageView || new HomepageView();
      this.homepageView.render();
      $(element).prepend(this.homepageView.el);
    },

    removeAll    : function() {

      // FIX: I'm unsure if it is necessary to destroy the homepage view
      //      here, undelegating all events, unbinding listeners, etc., or
      //      if removing it from the DOM is enough. I'm not sure if rendering
      //      it again would create a second instance of the view or simply 
      //      revive the old one.

      if (this.hasOwnProperty('homepageView')) { 
        this.homepageView.remove(); 
      }
    }
  });

  return AppPresenter; 
});