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

      it('creates a model view', function() {
        var newView = new ListItemView({model: task});
        newView.$modelView.should.exist;
      });

      it('creates an edit form', function() {
        var newView = new ListItemView({model: task});
        newView.$editForm.should.exist;
      });

      describe('listeners', function() {
        before(function() { 
          sinon.stub(Backbone.View.prototype, 'listenTo'); 
        });

        after(function() { Backbone.View.prototype.listenTo.restore(); });

        it('listens to changes in task status', function() {
          var newView = new ListItemView({model: task});
          Backbone.View.prototype.listenTo.withArgs(task, 'change:status').calledOnce.should.be.true;
        });

        it('listens for when the user is finished updating', function() {
          var newView = new ListItemView({model: task});
          Backbone.View.prototype.listenTo.withArgs(newView.$editForm, 'done').calledOnce.should.be.true;
        });
      });
    });

    describe('elements', function() {
      before(function() {
        view.render();
      });

      it('is an li', function() {
        view.$el[0].tagName.should.equal('LI');
      });

      it('has class task-list-item', function() {
        view.$el[0].className.should.include('task-list-item');
      });

      it('is draggable', function() {
        view.$el[0].className.should.include('ui-widget-content ui-draggable ui-draggable-handle')
      });

      describe('edit icon', function() {
        it('is present', function() {
          view.$('i[title="Edit"]').should.exist;
        });

        it('is hidden by default', function() {
          view.$('i[title="Edit"]').should.not.be.visible;
        });
      });

      describe('delete icon', function() {
        it('is present', function() {
          view.$('i[title="Delete"]').should.exist;
        });

        it('is hidden by default', function() {
          view.$('i[title="Delete"]').should.not.be.visible;
        });
      });
    });
  });
});