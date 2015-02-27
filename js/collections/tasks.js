define([
  'collections/protected-collection',
  'models/task',
  'api',
  'cookie'
], function(ProtectedCollection, TaskModel, API) {
  
  var TaskCollection = ProtectedCollection.extend({
    model      : TaskModel,
    comparator : 'position',
    url        : function() {
      return API.tasks.collection($.cookie('userID'));
    },

    initialize : function(models, opts) {
      opts = opts || {};
      this.grouping = opts.grouping;
    },

    addGrouping: function(grouping) {
      var that = this;
      for(attr in grouping) { 
        that.grouping[attr] = grouping[attr]; 

        badModels = that.filter(function(task) {
          return task.get(attr) != grouping[attr];
        });
        
        that.remove(badModels);
      }
    },

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

    fetch: function(opts) {
      opts = opts || {};

      if(opts.all === true) {
        opts.url = API.tasks.fullCollection($.cookie('userID'));
        delete opts.all;
      }

      ProtectedCollection.prototype.fetch.call(this, opts);
    }
  });

  return TaskCollection;
});