define(['underscore', 'backbone'], function(_, Backbone) {
  var ProtectedCollection = Backbone.Collection.extend({
    token: function() {
      return 'Basic ' + $.cookie('auth');
    },

    fetch: function(opts) {
      opts = opts || {};

      var that = this;

      opts.beforeSend = (opts.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', that.token());
      }

      return Backbone.Collection.prototype.fetch.call(this, opts);
    }
  });

  return ProtectedCollection;
});