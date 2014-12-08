define([
  'backbone', 
  'api',
  'utils',
  'collections/tasks'
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