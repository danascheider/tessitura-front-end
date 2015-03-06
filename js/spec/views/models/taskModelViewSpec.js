define([
  'backbone',
  'views/models/task/model',
  'models/task',
  'models/user',
  'cookie'
], function(Backbone, TaskView, Task, User) {

  describe('Task model view', function() {

    // Define variables for use in before blocks
    var view, e;
    var sandbox = sinon.sandbox.create();

    var user = new User({
      id: 342, 
      username   : 'testuser', 
      password   : 'testuser',
      email      : 'testuser@example.com',
      first_name : 'Test',
      last_name  : 'User'
    });

    var task = new Task({
      title        : 'My Task 1', 
      status       : 'New',
      priority     : 'Low',
      deadline     : new Date(2015, 08, 28),
      description  : "Test Canto's front-end functionality",
      owner_id     : 342,
      task_list_id : 14,
      position     : 1
    });

    beforeEach(function() {
      if(typeof view === 'undefined') {
        view = new TaskView({model: task});
      }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('el', function() {
      beforeEach(function() {
        view.render();
      });

      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      it('has class .task-model', function() {
        view.$el[0].className.should.equal('task-model');
      });
    });

    describe('view elements', function() {
      beforeEach(function() {
        view.render();
      });
      
      it('displays the task\'s title', function() {
        view.$('a.task-title').html().should.equal('My Task 1');
      });

      it('displays the task\'s deadline', function() {
        view.$('table.task-details').html().should.include('Monday, September 28, 2015');
      });

      it('displays the task\'s priority', function() {
        view.$('table.task-details').html().should.include('Low');
      });

      it('displays the task\'s status', function() {
        view.$('table.task-details').html().should.include('New');
      });

      it('displays the task\'s description', function() {
        view.$('table.task-details').html().should.include("Test Canto's front-end functionality");
      });

      it('does not display blank fields', function() {
        task.unset('deadline');
        view.render();
        view.$('tr.task-deadline-row').length.should.equal(0);
        task.set('deadline', new Date(2015, 8, 28));
      });

      describe('hidden quick-edit element', function() {
        it('is hidden by default', function() {
          view.$('input.quick-edit').should.not.be.visible;
        });
      });
    });

    describe('events', function() {
      describe('dblclick data field', function() {
        it('calls showInput', function() {
          sandbox.stub(TaskView.prototype, 'showInput');
          var newView = new TaskView({model: task});
          newView.render();
          newView.$('td[data-fieldname="status"]').dblclick();
          TaskView.prototype.showInput.calledOnce.should.be.true;
        });
      });

      describe('save model', function() {
        it('calls renderOnSync', function() {
          sandbox.stub(TaskView.prototype, 'renderOnSync');
          var newView = new TaskView({model: task});
          task.trigger('sync');
          TaskView.prototype.renderOnSync.calledOnce.should.be.true;
        });
      });
    });

    describe('renderOnSync() method', function() {
      beforeEach(function() { 
        sandbox.stub(view, 'render'); 
      });

      describe('when not marked complete', function() {
        it('calls the render function', function() {
          task.set('priority', 'Urgent');
          view.renderOnSync();
          view.render.calledOnce.should.be.true;
          task.set('priority', 'Low');
        });
      });

      describe('when marked complete', function() {
        it('does not call the render function', function() {
          task.set('status', 'Complete');
          view.renderOnSync();
          view.render.called.should.be.false;
          task.set('status', 'New');
        });
      });
    });

    describe('showInput() method', function() {
      beforeEach(function() {
        e = $.Event('dblclick', {target: view.$('td[data-fieldname="status"]')});
        view.render();
      });

      it('hides the task data', function() {
        view.showInput(e);
        view.$('td[data-fieldname="status"] .task-data').should.not.be.visible;
      });

      it('shows the input field', function() {
        view.showInput(e);
        view.$('input.quick-edit').should.be.visible;
      });

      it('puts the focus on the input field', function() {
        sinon.test(function() {
          $('body').html(view.el);
          view.showInput(e);
          view.$('input.quick-edit:focus').length.should.not.equal(1);
        });
      });
    });

    describe('render() function', function() {
      it('returns the view', function() {
        view.render().should.equal(view);
      });
    });
  });
});