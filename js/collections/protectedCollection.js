Tessitura = Tessitura || require('../dependencies.js');

/* Protected Collection
/****************************************************************************************/

var ProtectedCollection = Backbone.Collection.extend({
  token     : function() {
    return 'Basic ' + $.cookie('auth');
  },

  /* Tessitura Collection Properties
  /**************************************************************************************/

  klass     : 'ProtectedCollection',
  family    : 'Backbone.Collection',
  superFamily: 'Backbone.Collection',

  /* Special Functions
  /**************************************************************************************/

  destroy   : function() {
    this.reset([]);
    this.stopListening();
  },

  isA       : function(type) {
    return ['Backbone.Collection', 'ProtectedCollection'].indexOf(type) > -1 ? true : false;
  },

  /* Core Collection Functions
  /**************************************************************************************/

  fetch     : function(opts) {
    opts = opts || {};
    var that = this;

    opts.beforeSend = (opts.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', that.token());
    };

    Backbone.Collection.prototype.fetch.call(this, opts);
  }
});

module.exports = ProtectedCollection;