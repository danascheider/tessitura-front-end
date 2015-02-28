define([
  'backbone', 
  'api',
  'utils',
  'collections/tasks',
  'collections/protected-collection',
  'cookie'

  // FIX: Does ProtectedCollection really need to be included here?
  ], function(Backbone, API, Utils, TaskCollection, ProtectedCollection) {

  var User = Backbone.Model.extend({
    urlRoot: API.users.collection,
    
    initialize: function(attrs, options) {
      options = options || {};

      this.tasks = new TaskCollection({owner: this});

      // If the model exists on the server, its data should be fetched
      // on instantiation. This will only work if the user being instantiated
      // is also the logged-in user.

      if (!(options.sync === false) && this.get('id')) {
        this.protectedFetch();
      }
    },

    // The `fetch()` function overrides the default `fetch()` method to include
    // the HTTP basic auth header. The `fetch()` function differs from the 
    // `protectedFetch()` function in that it sends the request with the credentials
    // of the user being requested, whereas `protectedFetch() uses the credentials
    // of whichever user is logged in. 

    fetch: function(options) {
      options = options || {};
      options.url = (options.url || API.users.single(this.get('id')));

      var hash = btoa(this.get('username') + ':' + this.get('password'));

      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + hash);
      };

      return Backbone.Model.prototype.fetch.call(this, options);
    },

    // The `protectedFetch()` method fetches a user's data using the credentials
    // stored in the cookies (which may or may not be the credentials belonging
    // to the user whose data are being requested). This way, if a user attempts
    // to retrieve another user's data, the response will be a 401 error.

    protectedFetch: function(options) {
      options = options || {};
      options.url = options.url || API.users.single(this.get('id'));
      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      };

      return Backbone.Model.prototype.fetch.call(this, options);
    },

    fetchIncompleteTasks: function(options) {
      var that = this;
      options = options || {};

      options.url = options.url || API.tasks.collection(that.get('id'));
      return this.tasks.fetch(options);
    },

    fetchTasks: function() {
      var that = this;
      var data = JSON.stringify({resource: 'Task', scope: 'incomplete'});

      return new Promise(function(resolve, reject) {
        that.tasks.fetch({
          url  : API.tasks.fullCollection(that.get('id')),
          data : data,
          beforeSend: Utils.authHeader,
          success: function() {
            return resolve(that.tasks);
          },
          error: function(error, response) {
            return reject(response);
          }
        });
      });
    },

    name: function() {
      return this.get('first_name') + ' ' + this.get('last_name');
    },
  });
  
  return User;
});