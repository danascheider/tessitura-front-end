define([
  'underscore', 
  'backbone', 
  'api',
  'collections/tasks'
  ], function(_, Backbone, API, TaskCollection) {

  var User = Backbone.Model.extend({
    urlRoot: API.users.collection,
    
    initialize: function() {
      var id = this.id || $.cookie('userID');
      var taskFilter = {resource: 'Task', scope: 'incomplete'}
      var that = this;

      this.tasks = new TaskCollection;

      this.fetch({
        async: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        }
      });
    },

    name: function() {
      return this.firstName + ' ' + this.lastName;
    },
  });
  
  return User;
});