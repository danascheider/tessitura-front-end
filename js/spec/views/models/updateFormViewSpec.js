define([
  'backbone',
  'views/tasks/update-form',
  'models/task',
  'utils'
  ], function(Backbone, FormView, Task, Utils) {
  
  describe('Task Update Form View', function() {
    var view, server, e;
    var sandbox = sinon.sandbox.create();
    var task = new Task({title: 'My Task 1', priority: 'Normal', status: 'New'});

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new FormView({model: task}) }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(FormView.prototype, 'render');
        var newView = new FormView({model: task});
        FormView.prototype.render.called.should.be.false;
      });

      it('sets the model', function() {
        var newView = new FormView({model: task});
        newView.model.should.equal(task);
      });
    });

    describe('elements', function() {
      beforeEach(function() { view.render(); });

      it('is a form', function() {
        view.$el[0].tagName.should.equal('FORM');
      });

      it('has class .edit-form', function() {
        view.$el[0].className.should.include('edit-form');
      });

      describe('form fields', function() {
        _.each(['title', 'deadline', 'priority', 'status'], function(name) {
          it('has a \'' + name + '\' field', function() {
            view.$('input[name="' + name + '"]').length.should.equal(1);
          });
        });

        it('has a \'description\' field', function() {
          view.$('textarea[name="description"]').length.should.equal(1);
        });

        _.each(['submit', 'reset'], function(type) {
          it('has a \'' + type + '\' button', function() {
            view.$('button[type="' + type + '"]').length.should.equal(1);
          });
        });
      });
    });

    describe('events', function() {
      describe('submit form', function() {
        it('calls updateTask', function() {
          sinon.test(function() {
            sinon.stub(FormView.prototype, 'updateTask');
            var newView = new FormView({model: task});
            newView.render();
            newView.$el.submit();
            FormView.prototype.updateTask.calledOnce.should.be.true;
          });
        });
      });
    });

    describe('updateTask() method', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('submit', {target: view.$el});
        server = sandbox.useFakeServer();
        sandbox.stub(Utils, 'getAttributes').returns({status: 'Blocking'});
      });

      it('doesn\'t refresh the browser', function() {
        sandbox.stub(e, 'preventDefault');
        view.updateTask(e);
        e.preventDefault.calledOnce.should.be.true;
      });

      it('saves the model with the new attributes', function() {
        sandbox.stub(task, 'save');
        view.updateTask(e);
        task.save.withArgs({status: 'Blocking'}).calledOnce.should.be.true;
      });
    });

    describe('render() function', function() {
      it('sets the HTML', function() {
        sandbox.stub($.prototype, 'html');
        view.render();
        $.prototype.html.withArgs(view.template({model: task})).calledOnce.should.be.true;
      });

      it('calls delegateEvents', function() {
        sandbox.stub(view, 'delegateEvents');
        view.render();
        view.delegateEvents.calledOnce.should.be.true;
      });

      it('returns itself', function() {
        view.render().should.equal(view);
      });
    });
  });
});