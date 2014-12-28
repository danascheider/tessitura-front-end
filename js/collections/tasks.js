define([
  'backbone',
  'models/task',
  'api',
  'utils',
  'cookie'
], function(Backbone, TaskModel, API, Utils) {
  
  var TaskCollection = Backbone.Collection.extend({
    model      : TaskModel,
    comparator : 'position',
    url        : function() {
      return API.tasks.collection($.cookie('userID'));
    },

    refreshModels      : function() {
      _.each(this.models, function(model) {
        model.fetch({
          url        : API.tasks.single(model.id),
          beforeSend : Utils.authHeader 
        });
      });
    },

    repositionOnCreate : function() {
      _.each(this.models, function(task) {
        if (!task.isNew()) {
          task.save({
            url        : API.tasks.single(task.id),
            type       : 'PUT',
            beforeSend : Utils.authHeader,
            error      : function() {
              console.log('There was an error saving model ', task);
            }
          });
        }
      });
    },

    promiseCreate      : function(attributes) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.create(attributes, {
          url        : that.url(),
          beforeSend : Utils.authHeader,
          success    : function(model) {
            resolve(model);
          },
          error      : function(model, response) {
            reject(response);
          }
        });
      });
    }
  });

  return TaskCollection;
});