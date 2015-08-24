require('../../../js/tessitura.js');

var user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});

var task1 = new Tessitura.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1}),
    task2 = new Tessitura.TaskModel({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}),
    task3 = new Tessitura.TaskModel({id: 3, owner_id: 1, title: 'Task 3', status: 'Blocking', priority: 'High', position: 3}),
    task4 = new Tessitura.TaskModel({id: 4, owner_id: 1, title: 'Task 4', status: 'In Progress', priority: 'High', backlog: true, position: 4}),
    task5 = new Tessitura.TaskModel({id: 5, owner_id: 1, title: 'Task 5', status: 'Complete', priority: 'Normal', position: 5});

var collection = user.tasks = new Tessitura.TaskCollection([task1, task2, task3, task4, task5]);

var fach  = new Tessitura.FachModel({id: 1, type: 'soprano', quality: 'lyric', coloratura: true});

var org1 = new Tessitura.OrganizationModel({id: 1, name: 'Organization 1'}),
    org2 = new Tessitura.OrganizationModel({id: 2, name: 'Organization 2'}),
    org3 = new Tessitura.OrganizationModel({id: 3, name: 'Organization 3'});

var organizations = new Tessitura.OrganizationCollection([org1, org2, org3]);

Fixtures = {
  user            : user,
  task1           : task1,
  task2           : task2, 
  task3           : task3,
  task4           : task4,
  task5           : task5,
  collection      : collection,
  fach            : fach,
  org1            : org1,
  org2            : org2,
  org3            : org3,
  organizations   : organizations,

  restoreFixtures : function() {
    var that = this;

    this.user.set({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'}, {silent: true});
    this.task1.set({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1}, {silent: true});
    this.task2.set({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2}, {silent: true});
    this.task3.set({id: 3, owner_id: 1, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3}, {silent: true});
    this.task4.set({id: 4, owner_id: 1, title: 'Task 4', status: 'In Progress', priority: 'High', backlog: true, position: 4}, {silent: true});
    this.task5.set({id: 5, owner_id: 1, title: 'Task 5', status: 'Complete', priority: 'Normal', position: 5}, {silent: true});
    this.collection.reset([task1, task2, task3], {silent: true});
    this.fach.set({id: 1, type: 'soprano', quality: 'lyric', coloratura: true}, {silent: true});

    this.org1.set({id: 1, name: 'Organization 1'}, {silent: true});
    this.org2.set({id: 2, name: 'Organization 2'}, {silent: true});
    this.org3.set({id: 3, name: 'Organization 3'}, {silent: true});
    this.organizations.reset([org1, org2, org3], {silent: true});
  }
}

module.exports = Fixtures;