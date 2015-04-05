Canto = Canto || require('../dependencies.js');

var Task                = require('../models/taskModel.js');
var ProtectedCollection = require('./protectedCollection.js');

var TaskCollection = ProtectedCollection.extend({
  model      : Task,
  comparator : 'position',
  url        : function() {
    return Canto.API.tasks.collection($.cookie('userID'));
  },

  // ----------------- //
  // Special Functions //
  // ----------------- //

  // The isA() function returns true if passed one of the following
  // strings: 'TaskCollection', 'Backbone.Collection', 'ProtectedCollection'

  isA        : function(type) {
    var trueTypes = ['TaskCollection', 'Backbone.Collection', 'ProtectedCollection'];
    return trueTypes.indexOf(type) > -1 ? true : false;
  },

  // ------------------------- //
  // Core Collection Functions //
  // ------------------------- //

  // There are two routes for fetching a task collection: One to fetch only
  // the incomplete tasks (which is the default) and one for fetching all the
  // tasks. The fetch() method is being overridden here to do two things beyond
  // what the Backbone Collection fetch() method does by default:
  //    1. Add an authorization header to the request
  //    2. Change the request URL if the `all` option is set to `true`
  //
  // So there are two possibilities for using the fetch() method:
  //    collection.fetch();               // fetches incomplete tasks
  //    collection.fetch({all: true});    // fetches all tasks belonging to the logged-in user

  fetch      : function(opts) {
    opts = opts || {};

    if(!opts.url) {
      opts.url = opts.all === true ? Canto.API.tasks.fullCollection($.cookie('userID')) : this.url();
    }

    delete opts.all;

    ProtectedCollection.prototype.fetch.call(this, opts);
  }
});

module.exports = TaskCollection;