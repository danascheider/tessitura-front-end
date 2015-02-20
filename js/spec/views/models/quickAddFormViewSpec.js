define([
  'backbone', 
  'utils',
  'models/task',
  'collections/tasks',
  'views/tasks/quick-add-form'
  ], function(Backbone, Utils, Task, TaskCollection, QuickAddForm) {
  
  describe('Quick-Add Form View', function() {
    var form, e, server;
    var collection = new TaskCollection();

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
        sinon.stub(Utils, 'getAttributes').returns({title: 'Finish writing tests'});
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
    });

    describe('render() function', function() {
      //
    });
  });
});