define([
  'backbone', 
  'utils',
  'models/task',
  'collections/tasks',
  'views/tasks/quick-add-form'
  ], function(Backbone, Utils, Task, TaskCollection, QuickAddForm) {
  
  describe('Quick-Add Form View', function() {
    var form, e, server;
    var sandbox = sinon.sandbox.create();

    var task = new Task({id: 1, title: 'Increment task positions', status: 'Blocking', position: 1});
    var collection = new TaskCollection([task]);
    var data = {collection: collection, grouping: {status: 'Blocking'}};

    beforeEach(function() {
      if(typeof form === 'undefined') { form = new QuickAddForm(data); }
    });

    afterEach(function() {
      form.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(QuickAddForm.prototype, 'render');
        var newForm = new QuickAddForm(data);
        QuickAddForm.prototype.render.called.should.be.false;
      });

      it('sets the `grouping` property', function() {
        var newForm = new QuickAddForm(data);
        newForm.grouping.should.deep.equal({status: 'Blocking'});
      });
    });

    describe('elements', function() {
      beforeEach(function() { form.render(); });

      // FIX: Currently the tagName of the quick-add form is an `li`, but I
      //      want it to be a `form`.

      it('is a form', function() {
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
      sinon.test(function() {
        it('calls createTask when submitted', function() {
          sandbox.stub(QuickAddForm.prototype, 'createTask');
          var form = new QuickAddForm(data);
          form.render();
          form.$('form').submit();
          QuickAddForm.prototype.createTask.calledOnce.should.be.true;
        });
      });
    });

    describe('createTask() method', function() {
      beforeEach(function() {
        server = sandbox.useFakeServer();
        e = $.Event('submit', {target: form.$('form')});
      });

      afterEach(function() {
        collection.reset([task]);
        task.set('position', 1);
      });

      describe('when valid', function() {
        beforeEach(function() {
          sandbox.stub(Utils, 'getAttributes').returns({title: 'Finish writing tests', position: 1});
          server.respondWith(function(xhr) {
            xhr.respond(201, {'Content-Type': 'application/json'}, JSON.stringify({id: 2, title: 'Finish writing tests', position: 1}));
          });
          form.render();
        });

        afterEach(function() {
          Utils.getAttributes.restore();
        });

        it('doesn\'t refresh the browser', function() {
          sandbox.spy(e, 'preventDefault');
          form.createTask(e);
          e.preventDefault.calledOnce.should.be.true;
        });

        it('creates a new task in the collection', function() {
          sandbox.stub(collection, 'create');
          form.createTask(e);
          collection.create.calledOnce.should.be.true;
        });

        it('sets the new task\'s attributes according to its grouping', function() {
          sandbox.stub(collection, 'create');
          form.createTask(e);
          collection.create.args[0][0].status.should.equal('Blocking');
        });

        it('increments the position of the other tasks in the collection', function() {
          sandbox.spy(task, 'set');
          form.createTask(e);
          server.respond();
          task.set.withArgs('position', 2).calledOnce.should.be.true;
        });

        it('resets the form', function() {
          sandbox.stub(form.$('form')[0], 'reset');
          form.createTask(e);
          server.respond();
          form.$('form')[0].reset.calledOnce.should.be.true;
        });
      });

      describe('without a title', function() {
        it('doesn\'t create a task', function() {
          sandbox.stub(collection, 'create');
          sandbox.stub(Utils, 'getAttributes').returns({title: ''});
          form.createTask(e);
          collection.create.called.should.be.false;
        });
      });
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