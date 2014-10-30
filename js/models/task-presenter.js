define([
  'underscore',
  'backbone',
  'presenter'
], function(_, Backbone, Presenter) {

  var TaskPresenter = function(options) {
    Presenter.apply(this, arguments);

    this.deadline    = this.model.get('deadline') || '';
    this.description = this.model.get('description') || '';
    this.notes       = this.description;
  };
  
  TaskPresenter.prototype = _.extend(TaskPresenter.prototype, Presenter.prototype);
  
  return TaskPresenter;
});