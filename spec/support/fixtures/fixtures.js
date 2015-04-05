// Require the User model and create a user
var User = require('../../../js/models/userModel.js'),
    user = new User({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});

// Require the task model and create 3 tasks
var Task  = require('../../../js/models/taskModel.js'),
    task1 = new Task({id: 1, owner_id: 342, title: 'Task 1', status: 'New', priority: 'Low', position: 1}),
    task2 = new Task({id: 2, owner_id: 342, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}),
    task3 = new Task({id: 3, owner_id: 342, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

var Collection = require('../../../js/collections/taskCollection.js'),
    collection = new Collection([task1, task2, task3]);

var Fixtures = {
  user            : user,
  task1           : task1,
  task2           : task2, 
  task3           : task3,
  collection      : collection,

  restoreFixtures : function() {
    var that = this;

    this.user.set({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'}, {silent: true});
    this.task1.set({id: 1, owner_id: 342, title: 'Task 1', status: 'New', priority: 'Low', position: 1}, {silent: true});
    this.task2.set({id: 2, owner_id: 342, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}, {silent: true});
    this.task3.set({id: 3, owner_id: 342, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3}, {silent: true});
    this.collection.reset([that.task1, that.task2, that.task3], {silent: true});
  }
}

module.exports = Fixtures;