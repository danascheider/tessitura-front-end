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
    },

    promiseCreate : function(attributes) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.create(attributes, {
          url        : that.url(),
          beforeSend : function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
          },
          success    : function(model, response, options) {
            resolve(model);
          },
          error      : function(model, response, options) {
            reject(response);
          }
        });
      });
    }
  });

  return TaskCollection;
});