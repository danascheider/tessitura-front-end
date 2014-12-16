define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/app/homepage',
  'views/app/login-form'
], function($, _, Backbone, UserModel, HomepageView, LoginPageView) {

  var AppPresenter = Backbone.View.extend({
    initialize : function() {
      this.homepageView  = new HomepageView();
      this.loginPageView = new LoginPageView();

      this.listenTo(this.loginPageView, 'ajaxSuccess', this.emitLogin);
    },

    emitLogin   : function() {
      this.trigger('userLoggedIn');
    },

    getHomepage : function() {
      this.loginPageView.remove();

      this.homepageView = this.homepageView || new HomepageView();
      this.homepageView.render();
      return this.homepageView.el;
    },

    getLoginPage : function() {
      this.homepageView.remove();

      this.loginPageView = this.loginPageView || new LoginPageView();
      this.loginPageView.render();

      return this.loginPageView.el;
    },

    removeAll    : function() {
      if (!!this.homePageView) { this.homepageView.remove(); }
      if (!!this.loginPageView) { this.loginPageView.remove(); }
    }
  });

  return AppPresenter; 
});