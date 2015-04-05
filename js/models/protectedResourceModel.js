Canto       = Canto || require('../dependencies.js');
Canto.Model = Canto.Model || require('./cantoModel');

var ProtectedResource = Canto.Model.extend({
  token   : function() {
    return 'Basic ' + $.cookie('auth');
  },

  klass   : 'ProtectedResourceModel',

  destroy : function(opts) {
    opts = opts || {};

    var that = this;

    opts.beforeSend = (opts.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };

    return Backbone.Model.prototype.destroy.call(this, opts);
  },

  fetch   : function(opts) {
    opts = opts || {};

    var that = this;

    opts.beforeSend = (opts.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };

    return Backbone.Model.prototype.fetch.call(this, opts);
  },

  save    : function(attrs, opts) {
    opts  = opts || {};
    attrs = attrs || this.attributes;

    var that = this;

    opts.beforeSend = function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };

    return Backbone.Model.prototype.save.call(this, attrs, opts);
  },

  types   : function() {
    return Canto.Model.prototype.types().concat(['ProtectedResourceModel', 'ProtectedResource']);
  }
});

module.exports = ProtectedResource;