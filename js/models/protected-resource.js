define(['backbone', 'cookie'], function(Backbone, Utils) {
  
  var ProtectedResource = Backbone.Model.extend({

    save: function(attrs, options) {
      attrs = attrs || this.attributes;
      options = options || {};

      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      }

      return Backbone.Model.prototype.save.call(this, attrs, options);
    }
  });

  return ProtectedResource;
});