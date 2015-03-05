define(['backbone', 'models/task'], function(Backbone, TaskModel) {
  
  var FakeTask = TaskModel.extend({
    defaults   : {
      'title'    : 'Fake Task',
      'status'   : 'New',
      'priority' : 'Normal'
    },

    initialize : function() {
      this.originalAttributes = this.attributes;
    },

    reset      : function() {
      this.set(this.originalAttributes);
    }
  });

  return FakeTask;
});