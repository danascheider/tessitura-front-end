/* istanbul ignore next */
require('../../../js/tessitura.js');

/* istanbul ignore next */
var Fixtures = {};

// Require the User model and create a user
/* istanbul ignore next */
var user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});

// Require the task model and create 3 tasks
/* istanbul ignore next */
var task1 = new Tessitura.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1}),
    task2 = new Tessitura.TaskModel({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}),
    task3 = new Tessitura.TaskModel({id: 3, owner_id: 1, title: 'Task 3', status: 'Blocking', priority: 'High', position: 3}),
    task4 = new Tessitura.TaskModel({id: 4, owner_id: 1, title: 'Task 4', status: 'In Progress', priority: 'High', backlog: true, position: 4}),
    task5 = new Tessitura.TaskModel({id: 5, owner_id: 1, title: 'Task 5', status: 'Complete', priority: 'Normal', position: 5});
/* istanbul ignore next */
var collection = user.tasks = new Tessitura.TaskCollection([task1, task2, task3, task4, task5]);

var fach  = new Tessitura.FachModel({id: 1, type: 'soprano', quality: 'lyric', coloratura: true});

/* istanbul ignore next */
Fixtures = {
  user            : user,
  task1           : task1,
  task2           : task2, 
  task3           : task3,
  task4           : task4,
  task5           : task5,
  collection      : collection,
  fach            : fach,

  restoreFixtures : function() {
    var that = this;

    this.user.set({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'}, {silent: true});
    this.task1.set({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1}, {silent: true});
    this.task2.set({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}, {silent: true});
    this.task3.set({id: 3, owner_id: 1, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3}, {silent: true});
    this.collection.reset([task1, task2, task3]);
    this.fach.set({id: 1, type: 'soprano', quality: 'lyric', coloratura: true});
  }
}

/* istanbul ignore next */
module.exports = Fixtures;