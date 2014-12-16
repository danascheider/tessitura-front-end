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

    getHomepage : function(element) {
      this.loginPageView.remove();

      this.homepageView = this.homepageView || new HomepageView();
      this.homepageView.render();
      $(element).prepend(this.homepageView.el);
    },

    getLoginPage : function(element) {
      this.homepageView.remove();

      this.loginPageView = this.loginPageView || new LoginPageView();
      this.loginPageView.render();

      $(element).prepend(this.loginPageView.el);
    },

    removeAll    : function() {
      if (!!this.homePageView) { this.homepageView.remove(); }
      if (!!this.loginPageView) { this.loginPageView.remove(); }
    }
  });

  return AppPresenter; 
});