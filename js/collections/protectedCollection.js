/* Protected Collection 
/****************************************************************************************/

Canto = Canto || require('../dependencies.js');

/* Protected Collection
/****************************************************************************************/

var ProtectedCollection = Backbone.Collection.extend({
  token     : function() {
    return 'Basic ' + $.cookie('auth');
  },

  /* Special Functions
  /**************************************************************************************/

  isA       : function(type) {
    return ['Backbone.Collection', 'ProtectedCollection'].indexOf(type) > -1 ? true : false;
  },

  updateAll : function(opts) {
    opts         = opts || {};

    var that          = this;
    var callback      = opts.success;
    var changedModels = this.filter(function(model) {
      return model.hasChanged();
    });
    var toSync        = new Backbone.Collection(changedModels, {url: opts.url});

    opts.url        = opts.url || this.url;
    opts.beforeSend = (opts.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };
    opts.success    = function(obj, response, xhr) {
      if(callback) { callback.call(obj, response, xhr); }
      that.trigger('collectionSynced');
    }

    Backbone.sync('update', toSync, opts);
  },

  /* Core Collection Functions
  /**************************************************************************************/

  fetch     : function(opts) {
    opts = opts || {};

    var that = this;

    var callback = opts.success;

    opts.beforeSend = (opts.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };

    opts.success = function(model, response, xhr) {
      that.trigger('fetch');
      if(!!callback) { callback.call(model, response, xhr); }
    },

    Backbone.sync('read', this, opts);
  }
});

module.exports = ProtectedCollection;