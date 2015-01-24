define(['backbone', 'cookie'], function(Backbone, Utils) {
  
  var ProtectedResource = Backbone.Model.extend({
    token: function() {
      return 'Basic ' + $.cookie('auth');
    },

    save: function(attrs, options) {
      attrs = attrs || this.attributes;
      options = options || {};

      var that = this;

      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', that.token());
      }

      return Backbone.Model.prototype.save.call(this, attrs, options);
    },

    fetch: function(options) {
      options = options || {};

      var that = this; 

      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', that.token());
      }

      Backbone.Model.prototype.fetch.call(this, options);
    }
  });

  return ProtectedResource;
});