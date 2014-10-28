define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'models/task',
  'api'
], function($, _, Backbone, Cookie, TaskModel, API) {
  
  var TaskCollection = Backbone.Collection.extend({
    model : TaskModel,
    url   : function() {
      return API.tasks.collection($.cookie('userID'));
    }
  });

  return TaskCollection;
});