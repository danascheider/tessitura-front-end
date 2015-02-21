define([
  'backbone', 
  'utils',
  'models/task',
  'collections/tasks',
  'views/tasks/quick-add-form'
  ], function(Backbone, Utils, Task, TaskCollection, QuickAddForm) {
  
  describe('Quick-Add Form View', function() {
    var form, e, server;

    var task = new Task({id: 1, title: 'Increment task positions', position: 1});
    var collection = new TaskCollection([task]);

    beforeEach(function() {
      if(typeof form === 'undefined') { form = new QuickAddForm({collection: collection}); }
    });

    afterEach(function() {
      form.remove();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sinon.stub(QuickAddForm.prototype, 'render');
        var newForm = new QuickAddForm({collection: collection});
        QuickAddForm.prototype.render.called.should.be.false;
        QuickAddForm.prototype.render.restore();
      });
    });

    describe('elements', function() {
      beforeEach(function() { form.render(); });

      // FIX: Currently the tagName of the quick-add form is an `li`, but I
      //      want it to be a `form`.

      it('is an li', function() {
        form.$el[0].tagName.should.equal('LI');
      });

      it('has class .quick-add-form', function() {
        form.$el[0].className.should.include('quick-add-form');
      });

      it('has class .not-sortable', function() {
        form.$el[0].className.should.include('not-sortable');
      });
    });

    describe('events', function() {
      //
    });

    describe('createTask() method', function() {
      beforeEach(function() {
        server = sinon.fakeServer.create();
        e = $.Event('submit', {target: form.$('form')});
      });

      afterEach(function() {
        collection.reset([task]);
        task.set('position', 1);
      })

      describe('when valid', function() {
        beforeEach(function() {
          sinon.stub(Utils, 'getAttributes').returns({title: 'Finish writing tests', posiiton: 1});
          server.respondWith(function(xhr) {
            xhr.respond(201, {'Content-Type': 'application/json'}, JSON.stringify({id: 2, title: 'Finish writing tests', position: 1}));
          });
          form.render();
        });

        afterEach(function() {
          Utils.getAttributes.restore();
        });

        it('doesn\'t refresh the browser', function() {
          sinon.spy(e, 'preventDefault');
          form.createTask(e);
          e.preventDefault.calledOnce.should.be.true;
          e.preventDefault.restore();
        });

        it('creates a new task in the collection', function() {
          sinon.stub(collection, 'create');
          form.createTask(e);
          collection.create.calledOnce.should.be.true;
          collection.create.restore();
        });

        it('increments the position of the other tasks in the collection', function() {
          sinon.spy(task, 'set');
          form.createTask(e);
          server.respond();
          task.set.withArgs('position', 2).calledOnce.should.be.true;
          task.set.restore();
        });

        it('resets the form', function() {
          sinon.stub(form.$('form')[0], 'reset');
          form.createTask(e);
          server.respond();
          form.$('form')[0].reset.calledOnce.should.be.true;
          form.$('form')[0].reset.restore();
        });
      })

      describe('without a title', function() {
        it('doesn\'t submit', function() {
          sinon.stub(collection, 'create');
          sinon.stub(Utils, 'getAttributes').returns({title: ''});
          form.createTask(e);
          collection.create.called.should.be.false;
          collection.create.restore();
          Utils.getAttributes.restore();
        });
      })
    });

    describe('render() function', function() {
      it('sets its HTML', function() {
        sinon.stub($.prototype, 'html');
        form.render();
        $.prototype.html.calledOnce.should.be.true;
        $.prototype.html.restore();
      });

      it('calls delegateEvents', function() {
        sinon.spy(form, 'delegateEvents');
        form.render();
        form.delegateEvents.calledOnce.should.be.true;
        form.delegateEvents.restore();
      });
    });
  });
});