define(['backbone', 
  'views/app/dashboard-top-widgets',
  'models/task',
  'collections/tasks'
  ], function(Backbone, WidgetView, Task, TaskCollection) {
  
  describe('Dashboard Top Widget View', function() {
    var view, e;

    // var user = new User({
    //   id      : 342,
    //   username: 'testuser', 
    //   password: 'testuser', 
    //   email: 'testuser@example.com',
    //   first_name: 'Test',
    //   last_name: 'User'
    // });

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    var tasks = new TaskCollection([task1, task2, task3]);

    var data = {taskCollection: tasks, deadlineCount: 14, appointmentCount: 6, recommendationCount: 21}

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new WidgetView({data: data}); }
    });

    describe('constructor', function() {
      it('doesn\'t call render()', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new WidgetView({data: data});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });

      it('sets a data property', function() {
        var newView = new WidgetView({data: data});
        newView.data.should.equal(data);
      });

      // FIX: This should instead test whether the figures update when 
      //      the collection does, which would be more robust.

      it('listens to its task collection', function() {
        sinon.stub(Backbone.View.prototype, 'listenTo');
        var newView = new WidgetView({data: {taskCollection: tasks}});
        Backbone.View.prototype.listenTo.withArgs(tasks).called.should.be.true;
        Backbone.View.prototype.listenTo.restore();
      });
    });

    describe('elements', function() {
      beforeEach(function() { view.reset().render(); });

      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      describe('task widget', function() {
        it('is visible by default', function() {
          view.$('div.dash-widget[data-target="tasks"]').should.be.visible;
        });

        it('includes the task count', function() {
          view.$('div.dash-widget[data-target="tasks"] div.huge').html().should.include('3');
        });
      });

      describe('deadline widget', function() {
        it('is visible by default', function() {
          view.$('div.dash-widget:contains("Upcoming Deadlines!")').should.be.visible;
        });

        it('contains the deadline count', function() {
          var widget = view.$('div.dash-widget:contains("Upcoming Deadlines!") div.huge');
          widget.html().should.include('14');
        });
      });

      describe('appointment widget', function() {
        it('is visible by default', function() {
          view.$('div.dash-widget:contains("New Appointments!")').should.be.visible;
        });

        it('contains the appointment count', function() {
          var widget = view.$('div.dash-widget:contains("New Appointments!") div.huge');
          widget.html().should.include("6");
        });
      });

      describe('recommendation widget', function() {
        it('is visible by default', function() {
          view.$('div.dash-widget:contains("Recommendations!")').should.be.visible;
        });

        it('contains the recommendation count', function() {
          var widget = view.$('div.dash-widget:contains("Recommendations!") div.huge');
          widget.html().should.include('21');
        });
      });
    });

    describe('events', function() {
      beforeEach(function() { 
        sinon.stub(WidgetView.prototype, 'changeLinkColor');
        sinon.stub(WidgetView.prototype, 'changeLinkColorBack');
        sinon.stub(WidgetView.prototype, 'followLink');
      });

      afterEach(function() {
        WidgetView.prototype.changeLinkColor.restore();
        WidgetView.prototype.changeLinkColorBack.restore();
        WidgetView.prototype.followLink.restore();
      });

      describe('mouseenter .dash-widget', function() {
        it('calls changeLinkColor', function() {
          var newView = new WidgetView({data: data});
          newView.render();
          newView.$('.dash-widget').first().mouseenter();
          WidgetView.prototype.changeLinkColor.calledOnce.should.be.true;
          newView.remove();
        });
      });

      describe('mouseleave .dash-widget', function() {
        it('calls changeLinkColorBack', function() {
          var newView = new WidgetView({data: data});
          newView.render();
          newView.$('.dash-widget').first().mouseleave();
          WidgetView.prototype.changeLinkColorBack.calledOnce.should.be.true;
          newView.remove();
        });
      });
    });

    describe('changeLinkColor() method', function() {
      beforeEach(function() {
        view.reset().render();
        e = $.Event('mouseenter', {target: view.$('.dash-widget:contains("Recommendations!")')});
      });

      it('changes text color to the heading background color', function() {
        var heading = view.$('.dash-widget:contains("Recommendations!") .panel-heading');
        var color = heading.css('background-color');
        var body = heading.closest('.dash-widget').find('.panel-body');
        view.changeLinkColor(e);
        body.css('color').should.equal(color);
      });
    });

    describe('changeLinkColorBack() method', function() {
      beforeEach(function() { 
        view.reset().render(); 
        e = $.Event('mouseleave', {target: view.$('.dash-widget:contains("Upcoming Deadlines!")')});
        var color = $('.dash-widget:contains("Upcoming Deadlines!") .panel-heading').css('background-color');
        view.$('.dash-widget:contains("Upcoming Deadlines!") .panel-body').css('color', color);
      });

      it('changes the text color back to gray', function() {
        var body = view.$('.dash-widget:contains("Upcoming Deadlines!") .panel-body');
        view.changeLinkColorBack(e);
        body.css('color').should.equal('rgb(204, 204, 204)');
      });
    });

    describe('followLink() method', function() {
      beforeEach(function() {
        e = $.Event('click', {target: view.$('.dash-widget[data-target="tasks"]')});
        sinon.stub(Backbone.history, 'navigate');
      });

      afterEach(function() {
        Backbone.history.navigate.restore();
      });

      it('navigates to the URL specified in data-target', function() {
        view.followLink(e);
        Backbone.history.navigate.calledWithExactly('tasks', {trigger: true}).should.be.true;
      });
    });

    describe('render() function', function() {
      beforeEach(function() { view.reset(); });
      afterEach(function() { view.remove(); });

      it('sets the HTML of the element', function() {
        sinon.stub($.prototype, 'html');
        view.render();
        $.prototype.html.calledOnce.should.be.true;
        $.prototype.html.restore();
      });

      it('returns itself', function() {
        view.render().should.equal(view);
      });
    });

    describe('reset() method', function() {
      beforeEach(function() { view.render(); });
      afterEach(function() { view.remove(); });

      it('removes the view from the DOM', function() {
        sinon.stub(view, 'remove');
        view.reset();
        view.remove.calledOnce.should.be.true;
        view.remove.restore();
      });

      it('returns the view', function() {
        view.reset().should.equal(view);
      });
    });
  });
});