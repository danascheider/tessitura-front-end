define([
  'underscore',
], function(_) {

  var Presenter = function(options) {
    var options = options ? options : {};
    this.model = options.model;
    
    this.partial = function(template) {
      return template(_.extend(this, this.model.attributes));
    }
  }

  return Presenter;
});