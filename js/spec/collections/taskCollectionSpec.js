define([
  'backbone', 
  'collections/tasks', 
  'models/task',
  'models/user',
  'api', 
  'cookie'
], function(Backbone, TaskCollection, TaskModel, UserModel, API) {

  describe('TaskCollection', function() {
    var collection, server, xhr, requests;
    var sandbox = sinon.sandbox.create();

    // Create models that will be used to populate the collection under test

    var task1 = new TaskModel({id: 1, title: 'Task 1', status: 'New', priority: 'Normal', position: 1});
    var task2 = new TaskModel({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new TaskModel({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    // Set cookies to establish default collection for Ajax requests

    before(function() {
      $.cookie('userID', 4);
      $.cookie('auth', btoa('user4:user4')); 
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('constructor', function() {
      it('sets the models', function() {
        collection = new TaskCollection([task1, task2, task3]);
        collection.models.should.deep.equal([task1, task2, task3]);
      });
    });
    
    describe('comparator', function() {
      it('orders tasks by position');
    });

    describe('events', function() {
      after(function() { collection.reset([task1, task2, task3]); });

      it('calls incrementPositions when a new task is added', function() {
        sandbox.stub(TaskCollection.prototype, 'incrementPositions');
        collection = new TaskCollection([task1, task2, task3]);
        var newTask = new TaskModel({title: 'Hello' });
        collection.add(newTask);
        TaskCollection.prototype.incrementPositions.calledOnce.should.be.true;
      });
    });

    describe('default URL', function() {
      it('gets the URL for the logged-in user', function() {
        collection = new TaskCollection();
        collection.url().should.equal(API.base + '/users/4/tasks');
      });
    });

    describe('fetch() method', function() {
      beforeEach(function() {
        collection = new TaskCollection([task1, task2, task3]);
        server = sandbox.useFakeServer();
      });

      describe('normal circumstances', function() {
        it('sends the request to the default route', function() {
          collection.fetch();
          server.requests[0].url.should.equal(API.tasks.collection($.cookie('userID')));
        });

        it('calls the collection prototype fetch method', function() {
          sandbox.stub(Backbone.Collection.prototype, 'fetch');
          collection.fetch();
          Backbone.Collection.prototype.fetch.calledOnce.should.be.true;
        });
      });

      describe('with the \'all\' option', function() {
        it('sends the request to the \'all\' route', function() {
          collection.fetch({all: true});
          server.requests[0].url.should.equal(API.tasks.fullCollection($.cookie('userID')));
        });

        it('calls the collection prototype fetch method', function() {
          sinon.stub(Backbone.Collection.prototype, 'fetch');
          collection.fetch({all: true});
          Backbone.Collection.prototype.fetch.calledOnce.should.be.true;
          Backbone.Collection.prototype.fetch.restore();
        });
      });
    });

    describe('incrementPositions() method', function() {
      afterEach(function() { 
        task1.set('position', 1);
        task2.set('position', 2);
        task3.set('position', 3);
        collection.reset([task1, task2, task3]); 
      });

      it('increases all the positions by 1', function(done) {
        var newTask = new TaskModel({id: 4, title: 'Task 4', status: 'New', priority: 'Normal', position: 1});
        collection.incrementPositions(newTask);
        collection.pluck('position').should.deep.equal([2, 3, 4]);
        done();
      });

      it('doesn\'t affect the model passed as a parameter', function(done) {
        var newTask = new TaskModel({id: 4, title: 'Task 4', status: 'New', priority: 'Normal', position: 1});
        collection.add(newTask, {silent: true});
        collection.incrementPositions(newTask)
        newTask.get('position').should.equal(1);
        done();
      });

      it('doesn\'t affect models with lower indices', function(done) {
        var newTask = new TaskModel({id: 4, title: 'Task 4', status: 'New', priority: 'Normal', position: 2});
        collection.incrementPositions(newTask);
        task1.get('position').should.equal(1);
        done();
      });

      it('calls sync on the collection', function() {
        sandbox.stub(collection, 'sync');
        collection.incrementPositions(task1);
        collection.sync.calledOnce.should.be.true;
      });
    });
  });
});