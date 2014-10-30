define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var Presenter = function(options) {
    var options = options ? options : {};
    this.model = options.model;
  }

  Presenter.prototype.partial = function(template) {
    return template(_.extend(this, this.model.attributes));
  }

  return Presenter;
});