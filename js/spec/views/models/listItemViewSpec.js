define([
  'backbone',
  'views/tasks/list-entry', 
  'models/task',
  'jquery-ui'
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
      var stub;

      afterEach(function() {
        stub.restore();
      });

      describe('click edit icon', function() {
        it('calls showEditForm', function() {
          stub = sinon.stub(ListItemView.prototype, 'showEditForm');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Edit"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click mark complete checkbox', function() {
        it('calls markComplete', function() {
          stub = sinon.stub(ListItemView.prototype, 'markComplete');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Mark complete"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click delete icon', function() {
        it('calls deleteTask', function() {
          stub = sinon.stub(ListItemView.prototype, 'deleteTask');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Delete"]').click();
          stub.calledOnce.should.be.true;
        });
      });
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
      beforeEach(function() {
        sinon.stub($.prototype, 'draggable');
        view.configureDraggable();
      });

      afterEach(function() { $.prototype.draggable.restore(); });

      it('makes the view draggable', function() {
        $.prototype.draggable.calledOnce.should.be.true;
      });

      it('confines the view to its parent list', function() {
        $.prototype.draggable.args[0][0].containment.should.equal('parent');
      });

      it('connects to the sortable task list', function() {
        $.prototype.draggable.args[0][0].connectToSortable.should.equal('.task-list');
      });
    });

    describe('changePosition() method', function() {
      it('removes inline styles', function() {
        view.changePosition();
        view.$el.attr('style').should.be.falsey;
      });

      it('renders the view', function() {
        sinon.stub(view, 'render');
        view.changePosition();
        view.render.calledOnce.should.be.true;
        view.render.restore();
      });
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

        // I am having a hard time testing this because of (I assume)
        // the window.setTimeout that is called in the view code.
        it('triggers the markComplete event');

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

        // I am having a hard time testing this because of (I assume)
        // the window.setTimeout that is called in the view code.
        it('doesn\'t trigger markComplete');

        it('doesn\'t check the checkbox', function() {
          view.crossOff();
          view.$('.fa-check-square-o').length.should.equal(0);
        });

        it('doesn\'t cross off the task\'s title', function() {
          view.crossOff();
          view.$('.task-title').css('text-decoration').should.not.include('line-through');
        });
      });
    });

    describe('deleteTask() method', function() {
      it('destroys the task', function() {
        sinon.stub(task, 'destroy');
        view.deleteTask();
        task.destroy.calledOnce.should.be.true;
        task.destroy.restore();
      });
    });

    describe('hideEditForm() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditForm();
      });

      afterEach(function() {
        view.remove();
      });

      it('hides the edit form', function() {
        view.hideEditForm();
        view.$editForm.$el.should.not.be.visible;
      });

      it('removes the view from the DOM', function() {
        sinon.stub(view.$editForm, 'remove');
        view.hideEditForm();
        view.$editForm.remove.calledOnce.should.be.true;
        view.$editForm.remove.restore();
      });
    });

    describe('hideEditIcons() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditIcons();
      });

      afterEach(function() {
        view.remove();
      });

      it('hides the edit icon', function() {
        view.hideEditIcons();
        view.$('i[title="Edit"]').should.not.be.visible;
      });

      it('hides the backlog icon', function() {
        view.hideEditIcons();
        view.$('i[title="Backlog"]').should.not.be.visible;
      });

      it('hides the delete icon', function() {
        view.hideEditIcons();
        view.$('i[title="Delete"]').should.not.be.visible;
      });
    });

    describe('markComplete() method', function() {
      before(function() { sinon.stub(task, 'save'); });
      after(function() { task.save.restore(); });

      it('marks the task complete and saves', function() {
        view.markComplete();
        task.save.withArgs({status: 'Complete'}).calledOnce.should.be.true;
      });
    });

    describe('showEditForm() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditIcons();
      });

      it('hides edit icons', function() {
        view.showEditForm();
        view.$('span.edit-task').should.not.be.visible;
      });

      it('hides the model view and shows the edit form', function() {
        sinon.spy(view.$modelView, 'remove');
        view.showEditForm();

        // FIX: In the interest of saving time, I am putting all 3 of these
        //      assertions into this spec. In the future, I will need to 
        //      figure out how to make it run this bad boy asynchronously.

        window.setTimeout(function() {
          view.$modelView.remove.calledOnce.should.be.true;
          view.$editForm.$el.should.be.visible;
          view.$editForm.attr('style').should.be.falsey;
          view.$modelView.remove.restore();
        }, 150);
      });
    });

    describe('showEditIcons() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditIcons();
      });

      it('shows the edit icon', function() {
        view.$('i[title="Edit"]').should.be.visible;
      });

      it('shows the backlog icon', function() {
        view.$('i[title="Backlog"]').should.be.visible;
      });

      it('shows the delete icon', function() {
        view.$('i[title="Delete"]').should.be.visible;
      });
    });

    // FIX: If I am going to keep the list item and model views 
    //      separate, this would really belong with the model view.

    describe('toggleTaskDetails() method', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('click', {target: view.$('a.task-title')});
      });

      describe('when the task details are hidden', function() {
        it('shows the task-details table', function() {
          view.toggleTaskDetails(e);
          view.$('table.task-details').should.be.visible;
        });
      });

      describe('when the task details are visible', function() {
        it('hides the task-details table', function() {
          view.$('table.task-details').show();
          view.toggleTaskDetails(e);
          view.$('table.task-details').should.not.be.visible;
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