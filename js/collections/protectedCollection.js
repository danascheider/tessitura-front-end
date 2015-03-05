define(['underscore', 'backbone', 'cookie'], function(_, Backbone) {

  var ProtectedCollection = Backbone.Collection.extend({
    token: function() {
      return 'Basic ' + $.cookie('auth');
    },

    fetch: function(opts) {
      opts = opts || {};

      var that = this;

      opts.beforeSend = (opts.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', that.token());
      };

      return Backbone.Collection.prototype.fetch.call(this, opts);
    },

    updateAll: function(opts) {
      opts = opts || {};
      var that = this;
      var callback = opts.success;

      opts.url  = opts.url || this.url;
      opts.beforeSend = (opts.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', that.token());
      };
      opts.success = function(obj, response, xhr) {
        if(callback) { callback.call(obj, response, xhr); }
        that.trigger('collectionSynced');
      }

      var changedModels = this.filter(function(model) {
        return model.hasChanged();
      });

      toSync = new Backbone.Collection(changedModels, {url: opts.url});

      Backbone.sync('update', toSync, opts);
    }
  });

  return ProtectedCollection;
});