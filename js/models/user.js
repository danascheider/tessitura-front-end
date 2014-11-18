define([
  'underscore', 
  'backbone', 
  'api',
  'utils',
  'collections/tasks'
  ], function(_, Backbone, API, Utils, TaskCollection) {

  var User = Backbone.Model.extend({
    urlRoot: API.users.collection,
    
    initialize: function() {
      this.tasks = new TaskCollection({owner: this});

      this.fetch({
        async: false,
        beforeSend: Utils.authHeader
      });
    },

    fetchIncompleteTasks: function() {
      var that = this;
      var data = JSON.stringify({resource: 'Task', scope: 'incomplete'});

      return new Promise(function(resolve, reject) {
        that.tasks.fetch({
          url  : API.tasks.collection(that.id),
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

    fetchAllTasks: function() {
      var that = this;
      var data = JSON.stringify({resource: 'Task', scope: 'incomplete'});

      return new Promise(function(resolve, reject) {
        that.tasks.fetch({
          url  : API.tasks.fullCollection(that.id),
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
      return this.firstName + ' ' + this.lastName;
    },
  });
  
  return User;
});