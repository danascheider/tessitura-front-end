define([
  'backbone', 
  'api',
  'utils',
  'collections/tasks',
  'cookie'
  ], function(Backbone, API, Utils, TaskCollection) {

  var User = Backbone.Model.extend({
    urlRoot: API.users.collection,
    
    initialize: function() {
      this.tasks = new TaskCollection({owner: this});

      if(this.get('id')) {
        this.fetch({
          async: false,
          url  : API.users.single(this.get('id')),
          beforeSend: Utils.authHeader
        });
      }
    },

    // The `fetch()` function overrides the default `fetch()` method to include
    // the HTTP basic auth header. The `fetch()` function should only be used to
    // retrieve user profile information for admins, because it authorizes the
    // request using the requested user's credentials, rather than using the 
    // credentials from the cookie. This could facilitate fetching a user's
    // data without being logged in as that user (or without being logged in at all).
    // 
    // When fetching user data for a non-admin user, the `protectedFetch()` function
    // should be called.

    fetch: function(options) {
      options = options || {};
      options.url = (options.url || API.users.single(this.get('id')));

      if (!options.beforeSend) {
        var that = this;

        options.beforeSend = function(xhr) {
          var hash = btoa(that.get('username') + ':' + that.get('password'));
          xhr.setRequestHeader('Authorization', 'Basic ' + hash);
        }
      }

      return Backbone.Model.prototype.fetch.call(this, options);
    },

    // The `protectedFetch()` method fetches a user's data using the credentials
    // stored in the cookies (which may or may not be the credentials belonging
    // to the user whose data are being requested). This way, if a user attempts
    // to retrieve another user's data, the response will be a 401 error.

    protectedFetch: function(options) {
      this.fetch({
        url        : API.users.single(this.get('id')),
        beforeSend : Utils.authHeader,
        error      : function(model, response) {
          console.log('Error: Unable to retrieve user profile: ', response);
        }
      });
    },

    fetchIncompleteTasks: function() {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.tasks.fetch({
          url  : API.tasks.collection(that.id),
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