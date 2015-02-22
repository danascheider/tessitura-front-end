define([
  'backbone',
  'collections/tasks',
  'models/task',
  'views/tasks/task-panel'
  ], function(Backbone, TaskCollection, Task, TaskPanelView) {
  
  describe('Task Panel View', function() {
    var view, e;
    var sandbox = sinon.sandbox.create();

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    var collection = new TaskCollection([task1, task2, task3], {comparator: 'position'});

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new TaskPanelView({collection: collection}); }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(TaskPanelView.prototype, 'render');
        var newView = new TaskPanelView({collection: collection});
        TaskPanelView.prototype.render.calledOnce.should.be.false;
      });

      it('sets a collection', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.collection.should.exist;
      });

      it('instantiates a quick-add form', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.$quickAddForm.should.exist;
      });

      it('instantiates a collection view', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.$collectionView.should.exist;
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        view.render();
      });

      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      })

      it('has ID #task-panel', function() {
        view.$el[0].id.should.equal('task-panel');
      });

      it('has classname \'panel panel-primary dash-widget\'', function() {
        view.$el[0].className.should.equal('panel panel-primary dash-widget');
      });

      it('has a collection view', function() {
        view.$collectionView.$el.should.be.visible;
      });

      it('has a quick-add form', function() {
        view.$quickAddForm.$el.should.be.visible;
      });
    });

    describe('events', function() {
      //
    });

    describe('filterCollection() method', function() {
      before(function() {
        for(var i = 1; i < 20; i++) {
          var t = new Task({title: 'My Task ' + i});
          collection.add([t]);
        }
      });

      after(function() {
        collection.reset([task1, task2, task3]);
      });

      it('returns ten tasks', function() {
        view.filterCollection(collection).length.should.equal(10);
      });

      it('doesn\'t include complete tasks', function() {
        task3.set('status', 'Blocking');
        view.filterCollection(collection).should.not.include(task3);
        task3.set('status', 'Complete');
      });

      it('doesn\'t include backlogged tasks', function() {
        task1.set('backlog', true);
        view.filterCollection(collection).should.not.include(task1);
        task1.unset('backlog');
      });
    });

    describe('hideToggleWidgetIcon() method', function() {
      beforeEach(function() {
        view.render();
        view.showToggleWidgetIcon($.Event('mouseenter', {target: view.$el}));
        e = $.Event('mouseleave', {target: view.$el});
      });

      it('hides the toggle widget icon', function() {
        view.hideToggleWidgetIcon(e);
        view.$('span .hide-widget').should.not.be.visible;
      })
    });

    describe('hideWidget() method', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('click', {target: view.$('.hide-widget')});
      });

      it('hides the panel body', function() {
        view.hideWidget(e);
        view.$('div.panel-body').should.not.be.visible;
      });

      it('changes the icon class to show-widget', function() {
        view.hideWidget(e);
        view.$('span.pull-right')[0].className.should.include('show-widget');
      });

      it('changes the icon to fa-plus', function() {
        view.hideWidget(e);
        view.$('span.pull-right i')[0].className.should.include('fa-plus');
      });
    });

    describe('removeTask() method', function() {
      //
    });

    describe('showToggleWidgetIcon() method', function() {
      //
    });

    describe('showTaskForm() method', function() {
      //
    });

    describe('showWidget() method', function() {
      //
    });

    describe('remove() function', function() {
      beforeEach(function() { view.remove(); });

      it('removes the collection view from the DOM', function() {
        sandbox.stub(view.$collectionView, 'remove');
        view.remove();
        view.$collectionView.remove.calledOnce.should.be.true;
      });

      it('removes the quick-add form from the DOM', function() {
        sandbox.stub(view.$quickAddForm, 'remove');
        view.remove();
        view.$quickAddForm.remove.calledOnce.should.be.true;
      });

      it('removes itself', function() {
        sandbox.stub(Backbone.View.prototype.remove, 'call');
        view.remove();
        Backbone.View.prototype.remove.call.withArgs(view).calledOnce.should.be.true;
      });

      it('calls undelegateEvents', function() {
        sandbox.stub(view, 'undelegateEvents');
        view.remove();
        view.undelegateEvents.calledOnce.should.be.true;
      })
    });

    describe('render() function', function() {
      it('sets the HTML', function() {
        sandbox.stub($.prototype, 'html');
        view.render();
        $.prototype.html.withArgs(view.template()).calledOnce.should.be.true;
      });

      it('renders the collection view', function() {
        sandbox.stub(view.$collectionView, 'render');
        view.render();
        view.$collectionView.render.calledOnce.should.be.true;
      });

      it('renders the quickAddForm', function() {
        sandbox.stub(view.$quickAddForm, 'render');
        view.render();
        view.$quickAddForm.render.calledOnce.should.be.true;
      });

      it('calls delegateEvents on itself', function() {
        sandbox.stub(view, 'delegateEvents');
        view.render();
        view.delegateEvents.calledOnce.should.be.true;
      });

      it('calls delegateEvents on the collection view', function() {
        sandbox.stub(view.$collectionView, 'delegateEvents');
        view.render();
        view.$collectionView.delegateEvents.called.should.be.true;
      });

      it('calls delegateEvents on the quick-add form', function() {
        sandbox.stub(view.$quickAddForm, 'delegateEvents');
        view.render();
        view.$quickAddForm.delegateEvents.called.should.be.true;
      });

      it('configures sortable on the collection', function() {
        sandbox.stub($.prototype, 'sortable');
        view.render();
        $.prototype.sortable.called.should.be.true;
      });

      it('returns itself', function() {
        view.render().should.equal(view);
      });
    });
  });
});