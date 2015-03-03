define([
  'backbone',
  'models/user',
  'models/task',
  'api',
  'cookie'
], function(Backbone, User, Task, API) {

  describe('Task', function() {
    var task, server;
    var sandbox = sinon.sandbox.create();

    afterEach(function() { sandbox.restore(); });

    describe('urlRoot', function() {
      it('is scoped to the logged in user', function() {
        $.cookie('auth', btoa('testuser:testuser'));
        $.cookie('userID', 342);
        task = new Task();
        task.urlRoot().should.equal(API.base + '/users/342/tasks');
      });
    });

    describe('constructor', function() {
      it('calls the validation function', function() {
        task = new Task();
        sandbox.stub(task, 'validate');
        task.save();
        task.validate.calledOnce.should.be.true;
      });

      it('does not save the task automatically', function() {
        sandbox.spy(Backbone.Model.prototype, 'sync');
        task = new Task({title: 'Take out the trash'});
        Backbone.Model.prototype.sync.called.should.be.false;
      });
    });

    describe('general properties', function() {
      it('has an individual URL in the form /tasks/:id', function() {
        task = new Task({id: 12, title: 'Foo'});
        task.url().should.equal(API.base + '/tasks/12');
      });
    });

    describe('validations', function() {
      it('is invalid without a title', function() {
        task = new Task();
        task.isValid().should.be.false;
      });

      it('is valid with a title', function() {
        task = new Task({title: 'Take out the trash'});
        task.isValid().should.be.true;
      });
    });

    describe('complete() function', function() {
      it('is false for an incomplete task', function() {
        task = new Task({title: 'Take out the trash', status: 'In Progress'});
        task.complete().should.be.false;
      });

      it('is true for a complete task', function() {
        task = new Task({title: 'Take out the trash', status: 'Complete'});
        task.complete().should.be.true;
      });
    });

    describe('save() function', function() {
      beforeEach(function() {
        var cookie = sandbox.stub($, 'cookie');
        cookie.withArgs('auth').returns(btoa('testuser:testuser'))
        cookie.withArgs('userID').returns(342);
      });

      describe('when the task is new', function() {
        it('sends the request to the create endpoint', function() {
          task = new Task({id: 14, title: 'Take out the trash'});
          server = sandbox.useFakeServer();
          sandbox.stub(task, 'isNew').returns(true);
          task.save();
          server.requests[0].url.should.equal(API.base + '/users/342/tasks');
        });      
      });

      describe('when the task is not new', function() {
        beforeEach(function() { server = sandbox.useFakeServer(); });
        
        it('sends the request to the update endpoint', function() {
          task = new Task({id: 14, title: 'Take out the trash'});
          server = sandbox.useFakeServer();
          sandbox.stub(task, 'isNew').returns(false);
          task.save();
          server.requests[0].url.should.equal(API.base + '/tasks/14');
        });
      });
    });

    describe('displayTitle() function', function() {
      it('leaves a short title as-is', function() {
        task = new Task({title: 'Take out the trash'});
        task.displayTitle().should.equal('Take out the trash');
      });

      it('truncates a long title with an ellipsis', function() {
        task = new Task({title: 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood'});
        task.displayTitle().should.equal('Find out how much wood a woodchuck would chuck if a ...');
      });

      it('takes an argument into consideration', function() {
        task = new Task({title: 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood'});
        task.displayTitle(35).should.equal('Find out how much wood a ...');
      });
    });

    describe('fetch() function', function() {
      beforeEach(function() {
        var cookie = sandbox.stub($, 'cookie');
        cookie.withArgs('auth').returns(btoa('testuser:testuser'));
        cookie.withArgs('userID').returns(342);
        task = new Task({id: 114, title: 'Take out the trash'});
        server = sandbox.useFakeServer();
        task.fetch();
      });

      it('makes the request to the individual task endpoint', function() {
        server.requests[0].url.should.equal(API.base + '/tasks/114');
      });

      it('includes the correct authorization header', function() {
        var auth = 'Basic ' + btoa('testuser:testuser');
        server.requests[0].requestHeaders.Authorization.should.equal(auth);
      });
    });

    describe('incomplete() function', function() {
      it('returns true for incomplete tasks', function() {
        task = new Task({title: 'Take out the trash', status: 'New'});
        task.incomplete().should.be.true;
      });

      it('returns false for completed tasks', function() {
        task = new Task({title: 'Take out the trash', status: 'Complete'});
        task.incomplete().should.be.false;
      });
    });

    describe('prettyDeadline() function', function() {
      task = new Task({title: 'Take out the trash', deadline: new Date('2014-11-10 00:00:00 -0800')});
      task.prettyDeadline().should.equal('Monday, November 10, 2014');
    });
  });
});