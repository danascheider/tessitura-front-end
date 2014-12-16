define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'api',
  'utils',
  'models/user',
  'text!templates/app/homepage.html',
  'css!stylesheets/bootstrap.css',
  'css!fa-styles/font-awesome.min.css',
  'css!stylesheets/homepage.css',
  'css!stylesheets/canto.css'], function(
    $, 
    _, 
    Backbone, 
    Cookie,
    API,
    Utils,
    UserModel,
    HomepageTemplate){
  
  var HomepageView = Backbone.View.extend({
    events  : {
      'submit #registration-form' : 'createUser'
    },

    tagName : 'div',
    id      : 'homepage-wrapper',

    createUser : function(e) {
      e.preventDefault();
      var form = $(e.target);
      var attrs = Utils.getAttributes(form);
      var hash = btoa(attrs.username + ':' + attrs.password);

      var newUser = new UserModel(attrs);

      newUser.save(newUser.attrs, {
        url     : API.users.collection,
        type    : 'POST',
        success : function(model) {
          $.cookie('userID', model.id);
          $.cookie('auth', hash);
          Backbone.history.navigate('#dashboard', {trigger: true});
        },

        error : function(error, response) {
          console.log('Error: Model not created: ', response);
        }
      });
    },

    render : function() {
      this.$el.html(_.template(HomepageTemplate));
      return this;
    }
  });

  return HomepageView;
});