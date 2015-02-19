define([
  'backbone', 
  'views/tasks/list-entry', 
  'models/task'
  ], function(Backbone, ListItemView, Task) {

  describe('Task List Item View', function() {
    var view, server, e; 

    var task = new Task({title: 'Finish writing test suite', status: 'New', priority: 'Normal'});

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

      after(function() { view.remove(); });

      it('is an li', function() {
        view.$el[0].tagName.should.equal('LI');
      });

      it('has class task-list-item', function() {
        view.$el[0].className.should.include('task-list-item');
      });

      it('is draggable', function() {
        view.$el[0].className.should.include('ui-widget-content ui-draggable ui-draggable-handle')
      });

      it('has a mark-complete checkbox', function() {
        view.$('i[title="Mark complete"]').should.be.visible;
      });

      it('displays the task model', function() {
        view.$modelView.$el.should.be.visible;
      });

      it('doesn\'t show its edit form by default', function() {
        view.$editForm.$el.should.not.be.visible;
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

      describe('backlog icon', function() {
        it('is present', function() {
          view.$('i[title="Backlog"]').should.exist;
        });

        it('is hidden by default', function() {
          view.$('i[title="Backlog"]').should.not.be.visible;
        });
      });
    });

    describe('events', function() {
      //
    });

    describe('backlogTask() method', function() {
      beforeEach(function() {
        server = sinon.fakeServer.create();
        server.respondWith(function(xhr) {
          xhr.respond(200);
        });
      });

      after(function() {
        task.unset('backlog');
      });

      it('changes the task\'s backlog status to true', function() {
        view.backlogTask();
        task.get('backlog').should.be.true;
      });

      it('saves the task', function() {
        sinon.stub(task, 'save');
        view.backlogTask();
        task.save.calledOnce.should.be.true;
        task.save.restore();
      });
    });

    describe('configureDraggable() method', function() {
      //
    });

    describe('crossOff() method', function() {
      describe('when the task is complete', function() {
        before(function() { 
          view.render();
          task.set('status', 'Complete') 
        });

        after(function() { 
          task.set('status', 'New') 
          view.remove();
        });

        it('triggers the markComplete event', function() {
          var spy = sinon.spy();
          task.on('markComplete', spy);
          view.crossOff();
          window.setTimeout(function() {
            spy.calledOnce.should.be.true;
          }, 750);
        });

        it('checks the checkbox', function() {
          var checkbox = view.$('i[title="Mark complete"]');
          view.crossOff();
          checkbox[0].className.should.include('fa-check-square-o');
        });

        it('crosses out the task title', function() {
          view.crossOff();
          view.$('.task-title').css('text-decoration').should.equal('line-through');
        });
      });

      describe('when the task is incomplete', function() {
        beforeEach(function() {
          view.render();
        });

        it('doesn\'t trigger markComplete', function() {
          var spy = sinon.spy();
          task.on('markComplete', spy);
          view.crossOff();
          window.setTimeout(function() {
            spy.called.should.be.false;
          }, 750);
          task.off('markComplete');
        });

        it('doesn\'t check the checkbox', function() {
          view.$('.fa-check-square-o').length.should.equal(0);
        });
      });
    });

    describe('render() function', function() {
      afterEach(function() {
        view.remove();
      });

      it('sets the HTML', function() {
        sinon.stub($.prototype, 'html');
        view.render();
        $.prototype.html.called.should.be.true;
        $.prototype.html.restore();
      });

      it('returns itself', function() {
        view.render().should.equal(view);
      });

      it('configures the draggable property', function() {
        sinon.stub(view, 'configureDraggable');
        view.render();
        view.configureDraggable.calledOnce.should.be.true;
        view.configureDraggable.restore();
      });

      it('delegates events', function() {
        sinon.stub(view, 'delegateEvents');
        view.render();
        view.delegateEvents.calledOnce.should.be.true;
        view.delegateEvents.restore();
      });
    });
  });
});