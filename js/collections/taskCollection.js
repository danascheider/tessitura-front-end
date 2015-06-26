var TaskCollection = Tessitura.ProtectedCollection.extend({
  model      : Tessitura.TaskModel,
  comparator : 'position',
  url        : function() {
    return Tessitura.API.tasks.collection($.cookie('userID'));
  },

  /* Tessitura Collection Properties
  /**************************************************************************************/

  klass       : 'TaskCollection',
  types       : function() {
    return Tessitura.ProtectedCollection.prototype.types().concat(['TaskCollection']);
  },

  /* Core Collection Functions
  /**************************************************************************************/

  // There are two routes for fetching a task collection: One to fetch only
  // the incomplete tasks (which is the default) and one for fetching all the
  // tasks. The fetch() method is being overridden here to do one thing beyond
  // what the Protected Collection fetch() method does by default: Change the 
  // request URL if the `all` option is set to `true`.
  //
  // So there are two possibilities for using the fetch() method:
  //    collection.fetch();               // fetches incomplete tasks
  //    collection.fetch({all: true});    // fetches all tasks belonging to the logged-in user

  fetch      : function(opts) {
    opts = opts || {};

    if(!opts.url) {
      opts.url = opts.all === true ? Tessitura.API.tasks.fullCollection($.cookie('userID')) : this.url();
    }

    delete opts.all;

    Tessitura.ProtectedCollection.prototype.fetch.call(this, opts);
  }
});

module.exports = TaskCollection;