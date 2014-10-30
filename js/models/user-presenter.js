define([
  'underscore',
  'backbone', 
  'presenter'
], function(_, Backbone, Presenter) {
  var UserPresenter = _.extend(Presenter, {
    name : function() {
      return this.model.get('first_name') + ' ' + this.model.get('last_name')
    }
  });

  return UserPresenter;
});