define([
  'jquery',
  'underscore',
  'backbone',
  'models/task'
], function($, _, Backbone, TaskModel) {
  
  var TaskCollection = Backbone.Collection.extend({
    model     : TaskModel
  });

  return TaskCollection;
});