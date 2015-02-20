define([
  'backbone', 
  'models/task', 
  'models/user',
  'collections/tasks',
  'views/tasks/create-form', 
  'utils'
  ], function(Backbone, Task, User, TaskCollection, FormView, Utils) {
  
  describe('Task Creation Form View', function() {
    var form, e, server;

    var user = new User({
      id      : 342,
      username: 'testuser', 
      password: 'testuser', 
      email: 'testuser@example.com',
      first_name: 'Test',
      last_name: 'User'
    });

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    user.tasks = new TaskCollection([task1, task2, task3]);

    beforeEach(function() {
      if(typeof form === 'undefined') { form = new FormView({collection: user.tasks}); }
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sinon.stub(FormView.prototype, 'render');
        var newView = new FormView();
        FormView.prototype.render.called.should.be.false;
      });
    });

    describe('elements', function() {
      it('is a form', function() {
        form.render();
        form.$el[0].tagName.should.equal('FORM');
      });

      it('has class .task-form', function() {
        form.render();
        form.$el[0].className.should.include('task-form');
      });

      describe('form fields', function() {
        var fields = ['title', 'deadline', 'status', 'priority']

        beforeEach(function() {
          form.render();
        });

        // for(var i = 0; i < fields.length - 1; i++) {
        //   it('has a ' + fields[i] + ' field', function() {
        //     form.$('input[name="' + fields[i] + '"]').length.should.equal(1);
        //   });
        // }
      });
    });

    describe('events', function() {
      //
    });

    describe('createTask() method', function() {
      beforeEach(function() {
        e = $.Event('click', {target: form.$('button[type="submit"]')});
        server = sinon.fakeServer.create();
        sinon.stub(Utils, 'getAttributes').returns({title: 'Take out the trash'});
      });

      afterEach(function() {
        Utils.getAttributes.restore();
      });

      it('doesn\'t refresh the page', function() {
        sinon.spy(e, 'preventDefault');
        form.createTask(e);
        e.preventDefault.calledOnce.should.be.true;
        e.preventDefault.restore();
      });

      it('adds a task to the collection', function() {
        sinon.stub(user.tasks, 'create');
        form.createTask(e);
        user.tasks.create.withArgs({title: 'Take out the trash'}).calledOnce.should.be.true;
        user.tasks.create.restore();
      });
    });

    describe('render() function', function() {
      //
    });
  });
});