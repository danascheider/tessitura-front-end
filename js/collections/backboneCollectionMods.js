/* istanbul ignore next */ require('backbone');
/* istanbul ignore next */ require('underscore');

/* istanbul ignore next */ Backbone.Collection.prototype.klass = 'Backbone.Collection';

/* istanbul ignore next */
Backbone.Collection.prototype.types = function() {
  return ['Backbone.Collection']
};

/* istanbul ignore next */
Backbone.Collection.prototype.isA = function(type) {
  return this.types().indexOf(type) > -1 ? true : false;
};