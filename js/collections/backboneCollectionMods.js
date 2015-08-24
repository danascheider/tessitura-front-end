require('backbone');
require('underscore');

Backbone.Collection.prototype.klass = 'Backbone.Collection';

Backbone.Collection.prototype.types = function() {
  return ['Backbone.Collection']
};

Backbone.Collection.prototype.isA = function(type) {
  return this.types().indexOf(type) > -1 ? true : false;
};