define([
  'backbone',
  'views/tasks/list-entry', 
  'models/task',
  'spec/testTools',
  'jquery-ui'
  ], function(Backbone, ListItemView, Task, TestTools) {

  describe('Task List Item View', function() {
    var view, server, e; 
    var sandbox = sinon.sandbox.create();

    var task = new Task({title: 'Finish writing test suite', status: 'New', priority: 'Normal'});

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new ListItemView({model: task}); }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(Backbone.View.prototype, 'render');
        var newView = new ListItemView({model: task});
        Backbone.View.prototype.render.called.should.be.false;
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
        it('listens to changes in task status', function() {
          sandbox.stub(Backbone.View.prototype, 'listenTo'); 
          var newView = new ListItemView({model: task});
          Backbone.View.prototype.listenTo.withArgs(task, 'change:status').calledOnce.should.be.true;
        });

        it('listens for when the user is finished updating', function() {
          sandbox.stub(Backbone.View.prototype, 'listenTo'); 
          var newView = new ListItemView({model: task});
          Backbone.View.prototype.listenTo.withArgs(newView.$editForm, 'done').calledOnce.should.be.true;
        });
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        view.render();
      });

      it('is an li', function() {
        view.$el[0].tagName.should.equal('LI');
      });

      it('has class task-list-item', function() {
        view.$el[0].className.should.include('task-list-item');
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

      describe('draggable', function() {
        it('has class ui-widget-content', function() {
          view.$el[0].className.should.include('ui-widget-content');
        });

        it('has class ui-draggable', function() {
          view.$el[0].className.should.include('ui-draggable');
        });

        it('has class ui-draggable-handle', function() {
          view.$el[0].className.should.include('ui-draggable-handle');
        });
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
      describe('click edit icon', function() {
        it('calls showEditForm', function() {
          stub = sandbox.stub(ListItemView.prototype, 'showEditForm');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Edit"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click mark complete checkbox', function() {
        it('calls markComplete', function() {
          stub = sandbox.stub(ListItemView.prototype, 'markComplete');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Mark complete"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click delete icon', function() {
        it('calls deleteTask', function() {
          stub = sandbox.stub(ListItemView.prototype, 'deleteTask');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Delete"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click backlog icon', function() {
        it('calls backlogTask', function() {
          stub = sandbox.stub(ListItemView.prototype, 'backlogTask');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('i[title="Backlog"]').click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click task title', function() {
        it('calls toggleTaskDetails', function() {
          stub = sandbox.stub(ListItemView.prototype, 'toggleTaskDetails');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.$('.task-title').first().click();
          stub.calledOnce.should.be.true;
        });
      });

      describe('click reset button', function() {
        it('calls hideEditForm', function(done) {
          stub = sandbox.stub(ListItemView.prototype, 'hideEditForm');
          var newView = new ListItemView({model: task});
          newView.render();
          newView.showEditForm();

          TestTools.delay(150, done, function() {
            newView.$editForm.$('button:reset').click();
            stub.calledOnce.should.be.true;
          });
        });
      });

      describe('mouseenter', function() {
        it('calls showEditIcons', function() {
          stub = sandbox.stub(ListItemView.prototype, 'showEditIcons');
          var newView = new ListItemView({model: task});
          newView.$el.mouseenter();
          stub.calledOnce.should.be.true;
        });
      });

      describe('mouseleave', function() {
        it('calls hideEditIcons', function() {
          stub = sandbox.stub(ListItemView.prototype, 'hideEditIcons');
          var newView = new ListItemView({model: task});
          newView.$el.mouseleave();
          stub.calledOnce.should.be.true;
        })
      })
    });

    describe('backlogTask() method', function() {
      beforeEach(function() {
        server = sandbox.useFakeServer();
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
        sandbox.stub(task, 'save');
        view.backlogTask();
        task.save.calledOnce.should.be.true;
      });
    });

    describe('configureDraggable() method', function() {
      beforeEach(function() {
        sandbox.stub($.prototype, 'draggable');
        view.configureDraggable();
      });

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
        sandbox.stub(view, 'render');
        view.changePosition();
        view.render.calledOnce.should.be.true;
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
        });

        // FIX: Use Mocha's asynchronous testing to test the delayed
        //      trigger on this.

        // it('triggers the markComplete event', function(done) {
        //   var spy = sandbox.spy();
        //   task.on('markComplete', spy);
        //   view.crossOff();

        //   TestTools.delay(750, done, function() {
        //     spy.calledOnce.should.be.true;
        //   });

        //   task.off('markComplete');
        // });

        it('crosses out the task title', function() {
          view.crossOff();
          view.$('.task-title').css('text-decoration').should.equal('line-through');
        });
      });

      describe('when the task is incomplete', function() {
        beforeEach(function() {
          view.render();
          view.crossOff();
        });

        // FIX: Use Mocha's asynchronous testing to make this work

        it('doesn\'t trigger markComplete');

        it('doesn\'t check the checkbox', function() {
          view.$('.fa-check-square-o').length.should.equal(0);
        });

        it('doesn\'t cross off the task\'s title', function() {
          view.$('.task-title').css('text-decoration').should.not.include('line-through');
        });
      });
    });

    describe('deleteTask() method', function() {
      it('destroys the task', function() {
        sandbox.stub(task, 'destroy');
        view.deleteTask();
        task.destroy.calledOnce.should.be.true;
      });
    });

    describe('hideEditForm() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditForm();
      });

      it('hides the edit form', function() {
        view.hideEditForm();
        view.$editForm.$el.should.not.be.visible;
      });

      it('removes the view from the DOM', function() {
        sandbox.stub(view.$editForm, 'remove');
        view.hideEditForm();
        view.$editForm.remove.calledOnce.should.be.true;
      });
    });

    describe('hideEditIcons() method', function() {
      beforeEach(function() {
        view.render();
        view.showEditIcons();
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
      before(function() { 
        view.render();
        server = sandbox.useFakeServer();
        server.respondWith(function(xhr) {
          xhr.respond(200);
        });
        sandbox.spy(task, 'save');
      });

      it('marks the task complete and saves', function() {
        view.markComplete();
        task.save.withArgs({status: 'Complete'}).calledOnce.should.be.true;
      });

      it('checks the checkbox', function() {
        view.markComplete();
        server.respond();
        view.$('i.fa-check-square-o').should.be.visible;
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

      it('removes the model view from the DOM', function(done) {
        sandbox.stub(view.$modelView, 'remove');
        view.showEditForm();

        TestTools.delay(150, done, function() {
          view.$modelView.remove.called.should.be.true;
        });
      });

      it('hides the model view', function(done) {
        view.showEditForm();
        view.$modelView.$el.should.not.be.visible;
        done();
      });

      it('shows the edit form', function(done) {
        view.showEditForm();
        view.$editForm.$el.should.be.visible;
        done();
      });

      it('removes inline styles', function(done) {
        view.showEditForm();
        view.$editForm.$el.attr('style').should.be.falsey;
        done();
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
      it('sets the HTML', function() {
        sandbox.stub($.prototype, 'html');
        view.render();
        $.prototype.html.called.should.be.true;
      });

      it('returns itself', function() {
        view.render().should.equal(view);
      });

      it('configures the draggable property', function() {
        sandbox.stub(view, 'configureDraggable');
        view.render();
        view.configureDraggable.calledOnce.should.be.true;
      });

      it('delegates events', function() {
        sandbox.stub(view, 'delegateEvents');
        view.render();
        view.delegateEvents.calledOnce.should.be.true;
      });
    });
  });
});