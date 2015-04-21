var _        = require('underscore');
var Backbone = require('backbone');

global.Barista = {
  Model                : require('./model.js'),
  Collection           : require('./collection.js'),

  // The `config` method takes your `app` object as an argument and uses it to configure
  // the fixtures.
  // 
  // The `config` method identifies models by searching within the `app` object for keys
  // containing the string 'model' or 'Model'. Likewise, it identifies collections by 
  // searching within the `app` object for keys containing the string 'collection' or 
  // 'Collection'. It then extends its own model and collection classes with the
  // properties of the Backbone model.

  config               : function(app) {
    var keys = _.keys(app),
        that = this;

    this.Model.prototype.initialize = function() {
      that._modelInstances.push(this);
    };

    this.Collection.prototype.initialize = function() {
      that._collectionInstances.push(this);
    };

    _.each(keys, function(key) {
      if(key.match(/[Mm]odel/)) {
        that[key] = that.Model.extend(app[key]);
      } else if (key.match(/[Cc]ollection/)) {
        that[key] = that.Collection.extend(app[key]);
      }
    });

    _.each(this, function(value, key) {
      if(!value) { return; }
      var orig = value.initialize;

      if(key.match(/[Mm]odel/)) {
        value.initialize = function() {
          if(orig) { orig.apply(this, arguments); }
          that.Model.prototype.initialize.apply(this);
        };
      } else if (key.match(/[Ccollection]/)) {
        value.initialize = function() {
          if(orig) { orig.apply(this, arguments); }
          that.Collection.prototype.initialize.apply(this);
        };
      }
    });
  },

  destroy              : function() {
    var that = this;

    _.each(this._modelInstances, function(model) {
      model.destroy();
      var index = that._modelInstances.indexOf(model);
      that._modelInstances[index] = null;
    });

    _.each(this._collectionInstances, function(collection) {
      collection.destroy();
      var index = that._collectionInstances.indexOf(collection);
      that._collectionInstances[index] = null;
    });

    that._modelInstances = [];
    that._collectionInstances = [];
  },

  _modelInstances      : [],
  _collectionInstances : []
};

Barista.Model.extend = Barista.Collection.extend = Backbone.Model.extend;
module.exports = Barista;