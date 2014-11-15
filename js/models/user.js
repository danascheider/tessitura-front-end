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
      // Main task collection will be scoped, generally to return only
      // incomplete tasks
      this.tasks = new TaskCollection({owner: this});

      this.fetch({
        async: false,
        beforeSend: Utils.authHeader
      });
    },

    fetchIncompleteTasks: function(auth) {
      var that = this;
      var data = JSON.stringify({resource: 'Task', scope: 'incomplete'});

      return new Promise(function(resolve, reject) {
        that.tasks.fetch({
          url  : API.users.filter(that.id),
          type : 'POST',
          data : data,
          beforeSend: Utils.authHeader,
          success: function(collection, response, options) {
            return resolve(that.tasks);
          },
          error: function(error, status, options) { // or something
            return reject(error);
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