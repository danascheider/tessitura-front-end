define([
  'underscore',
  'backbone', 
  'presenter'
], function(_, Backbone, Presenter) {

  var UserPresenter = function(options) {
    Presenter.apply(this, arguments);

    this.name = this.model.get('first_name') + ' ' + this.model.get('last_name');
  };

  UserPresenter.prototype = _.extend(UserPresenter.prototype, Presenter.prototype);

  return UserPresenter;
});