define([
  'backbone', 
  'models/task',
  'collections/tasks',
  'collections/subset'
  ], function(Backbone, Task, TaskCollection, Subset) {
  
  describe('Subset Collection', function() {
    var subset;
    var sandbox = sinon.sandbox.create();

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Normal', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    var parent = new TaskCollection([task1, task2, task3]);

    describe('constructor', function() {
      it('sets the `parent` attribute', function() {
        var subset = new Subset([task1, task2], {model: Task, parent: parent, grouping: {status: 'New'}});
        subset.parent.should.equal(parent);
      });
    });
  });
});