define([
  'backbone', 
  'views/tasks/list-entry', 
  'models/task'
  ], function(Backbone, ListItemView, Task) {

  describe('Task List Item View', function() {
    var view, e; 

    var task = new Task({title: 'Finish writing test suite'});

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new ListItemView({model: task}); }
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new ListItemView({model: task});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });
    });
  });
});