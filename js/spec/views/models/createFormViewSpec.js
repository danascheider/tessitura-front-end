define(['backbone', 'models/task', 'views/tasks/create-form'], function(Backbone, Task, FormView) {
  
  describe('Task Creation Form View', function() {
    var form, e;

    beforeEach(function() {
      if(typeof form === 'undefined') { form = new FormView(); }
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
    });

    describe('events', function() {
      //
    });

    describe('createTask() method', function() {
      //
    });

    describe('render() function', function() {
      //
    });
  });
});