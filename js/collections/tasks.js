define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'models/task'
], function($, _, Backbone, Cookie, TaskModel) {
  
  var TaskCollection = Backbone.Collection.extend({
    url   : 'http://localhost:9292/users/' + $.cookie('userID') + '/tasks',
    model : TaskModel
  });

  return TaskCollection;
});