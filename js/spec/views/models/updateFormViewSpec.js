define([
  'backbone',
  'views/tasks/update-form',
  'models/task'
  ], function(Backbone, FormView, Task) {
  
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
    });
  });
});