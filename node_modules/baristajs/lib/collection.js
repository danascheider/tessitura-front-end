var _        = require('underscore'),
    Backbone = require('backbone'),
    Model    = require('./model.js');

var Collection = Backbone.Collection.extend({
  types : ['Backbone.Collection', 'Barista.Collection'],
  isA   : function(type) {
    return this.types.indexOf(type) > -1;
  }
});

_.extend(Collection.prototype, {
  model  : Model,
  sync   : function(args) {
    return this;
  },
  destroy: function() {
    this.reset([]);
    this.stopListening();
  },
  fetch  : function(opts) {
    this.trigger('sync', this, {}, opts);
  }
});

module.exports = Collection;