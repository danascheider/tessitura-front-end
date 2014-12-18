define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/app/homepage',
], function($, _, Backbone, UserModel, HomepageView, LoginPageView) {

  var AppPresenter = Backbone.View.extend({
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
      if (!!this.homePageView) { this.homepageView.remove(); }
    }
  });

  return AppPresenter; 
});