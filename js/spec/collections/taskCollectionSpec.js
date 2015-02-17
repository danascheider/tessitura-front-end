define([
  'backbone', 
  'collections/tasks', 
  'models/task',
  'models/user',
  'api', 
  'cookie'
], function(Backbone, TaskCollection, TaskModel, UserModel, API) {

  describe('TaskCollection', function() {

    // Set cookies to establish default collection for Ajax requests

    before(function() {
      $.cookie('userID', 4);
      $.cookie('auth', btoa('user4:user4')); 
    });

    // Declare variables to be defined in before hooks

    var collection, server, xhr, requests;

    // Create models that will be used to populate the collection under test

    var task1 = new TaskModel({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new TaskModel({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new TaskModel({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    describe('comparator', function() {
      it('orders tasks by position');
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
        server = sinon.fakeServer.create();
      });

      describe('normal circumstances', function() {
        it('sends the request to the default route', function() {
          collection.fetch();
          server.requests[0].url.should.equal(API.tasks.collection($.cookie('userID')));
        });

        it('calls the collection prototype fetch method', function() {
          sinon.stub(Backbone.Collection.prototype, 'fetch');
          collection.fetch();
          Backbone.Collection.prototype.fetch.calledOnce.should.be.true;
          Backbone.Collection.prototype.fetch.restore();
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
  });
});