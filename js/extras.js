define([
  'jquery', 
  'cookie', 
  'models/session', 
  'models/user',
  'models/task',
  'collections/task-collection'
  ], function($, Cookie, Session, UserModel, TaskModel, TaskCollection) {

  var extras = {

    // Basic info for Ajax requests //

    basePath : 'http://localhost:9292',

    // Functions //

    fetchSessionData: function() {
      var user, tasks;

      this.fetchUser().done(function(person) {
        user = person;
        return user;
      });

      // this.fetchTasks().done(function(items) {
      //   tasks = items;
      //   return tasks;
      // });

      // return {user: user, tasks: tasks};
      return user;
    },

    fetchTasks: function() {
      var tasks;
      var uid = $.cookie('userID');

      return $.ajax({
        url: this.basePath + '/users/' + uid + '/tasks',
        type: 'GET',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          var taskCollection = new TaskCollection;
          var tasks = JSON.parse(data);

          for(var i = 0; i < tasks.length; i++) {
            taskCollection.create(tasks[i], {remote: false});
          }

          return taskCollection;
        },
        error: function(xhr, status, error) {
          console.log('Error: ', error);
        }
      });
    },

    fetchUser: function() {
      var currentUser;
      var uid = $.cookie('userID');

      return $.ajax({ // Why does this need `return`? I have no fucking idea.
        url: this.basePath + '/users/' + uid,
        type: 'GET',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
        },
        success: function(data, status, xhr) {
          currentUser = new UserModel(data);
          currentUser.save(currentUser.attributes, {remote: false});
          return currentUser;
        },
        error: function(xhr, status, error) {
          console.log('Error: ', error);
        }
      });
    },

    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(key in formData) {
        var chiave = formData[key]['name'];
        if(formData[key]['value'] != '') {
          attributes[chiave] = formData[key]['value'];
        }
      }

      return attributes;
    },

    getAuthHash: function(username, password) {
      return btoa(username + ':' + password);
    },

    makeBasicAuth: function(username, password) {
      return 'Basic ' + this.getAuthHash(username, password);
    },

    setCookie: function(username, password, uid) {
      $.cookie('auth', this.getAuthHash(username, password));
      $.cookie('userID', uid);
    }
  };

  return extras;
});