var _        = require('underscore'),
    Backbone = require('backbone')

var Model = Backbone.Model.extend({
  types: ['Backbone.Model', 'Barista.Model'],
  isA  : function(type) {
    return this.types.indexOf(type) > -1;
  }
});

_.extend(Model.prototype, {
  changed: null,
  validationError: null,
  idAttribute    : 'id',
  toJSON         : function(options) {
    return _.clone(this.attributes)
  },
  sync           : function(opts) {
    opts = opts || {};
    this.changed = {};
    if(!opts.silent) this.trigger('change');
    return this;
  },
  fetch          : function(opts) {
    opts = opts || {};
    if(!opts.silent) this.trigger('sync', this, {}, opts);
    return this;
  },
  save           : function(key, val, opts) {
    opts  = opts || {};
    Backbone.Model.prototype.save.call(this, key, val, opts);
    this.trigger('sync', this, {}, opts);
    return this;
  },
  destroy        : function(opts) {
    opts = opts || {};
    Backbone.Model.prototype.destroy.call(this, opts);
    this.stopListening();
    if(opts.success) opts.success();
    this.trigger('destroy', this, this.collection, opts);
    this.trigger('sync', this, {}, opts);
    return this.isNew() ? false : this;
  }
});

Model.prototype.extend = function(obj) {
  return _.extend(this, obj);
};

module.exports = Model;