define([
  'underscore', 
  'backbone', 
  'collections/tasks', 
  'spec/tools/fakeTask'
  ], function(_, Backbone, TaskCollection, FakeTask) {
  
  var FakeTaskCollection = TaskCollection.extend({
    initialize: function(models, opts, count) {
      models = models || [];
      opts   = opts || {};
      count  = count || 3;

      if(!models.length) {
        for(var i = 1; i <= count; i++) {
          this.add(new FakeTask({id: i, position: i}));
        }
      }

      this.originalModels  = this.models;
      this.originalOptions = opts;
    },

    restoreToFactory: function() {
      this.reset(this.originalModels, this.originalOptions);
      _.each(this.models, function(model) { model.reset(); });
    },

    destroy: function() {
      var that = this;
      for(i in this.models) {
        this.models[i].destroy();
      }
    }
  });

  return FakeTaskCollection;
});