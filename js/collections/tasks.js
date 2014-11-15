define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'models/task',
  'api',
  'utils'
], function($, _, Backbone, Cookie, TaskModel, API, Utils) {
  
  var TaskCollection = Backbone.Collection.extend({
    model : TaskModel,

    url   : function() {
      return API.tasks.collection($.cookie('userID'));
    },

    promiseCreate : function(attributes) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.create(attributes, {
          url        : that.url(),
          beforeSend : Utils.authHeader,
          success    : function(model, response, options) {
            resolve(model);
          },
          error      : function(model, response, options) {
            reject(model);
          }
        });
      });
    }
  });

  return TaskCollection;
});