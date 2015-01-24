define([
  'backbone',
  'models/task',
  'api',
  'utils',
  'cookie'
], function(Backbone, TaskModel, API, Utils) {
  
  var TaskCollection = Backbone.Collection.extend({
    model      : TaskModel,
    comparator : 'position',
    url        : function() {
      return API.tasks.collection($.cookie('userID'));
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

      opts.beforeSend = Utils.authHeader;

      Backbone.Collection.prototype.fetch.call(this, opts);
    },

    refreshModels      : function() {
      _.each(this.models, function(model) {
        model.fetch();
      });
    },

    repositionOnCreate : function() {
      _.each(this.models, function(task) {
        if (!task.isNew()) {
          task.save({
            url        : API.tasks.single(task.id),
            type       : 'PUT',
            beforeSend : Utils.authHeader,
            error      : function() {
              console.log('There was an error saving model ', task);
            }
          });
        }
      });
    },

    promiseCreate      : function(attributes) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.create(attributes, {
          url        : that.url(),
          beforeSend : Utils.authHeader,
          success    : function(model) {
            resolve(model);
          },
          error      : function(model, response) {
            reject(response);
          }
        });
      });
    }
  });

  return TaskCollection;
});