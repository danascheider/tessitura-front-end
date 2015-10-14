require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    ccontext       = ddescribe;

/* Dashboard Top Widget View Spec
/****************************************************************************************/

describe('Dashboard Top Widget View', function() {
  var view, newView, collection, data, e, newView;

  beforeEach(function() {
    this.addMatchers(matchers);
    var task = new Tessitura.TaskModel({title: 'Hello World'});
    collection = new Tessitura.TaskCollection([task]);
    data = {
      taskCollection: collection,
      deadlineCount: 6,
      appointmentCount: 2,
      recommendationCount: 12
    };

    view = new Tessitura.DashboardTopWidgetView(data);
  });

  afterEach(function() { 
    view.destroy();
    collection.destroy();
    newView && newView.destroy();
  });

  describe('constructor', function() {
    it('doesn\'t call render #dashboardTopWidgetView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardTopWidgetView.prototype, 'render');
      var newView = new Tessitura.DashboardTopWidgetView(data);
      expect(Tessitura.DashboardTopWidgetView.prototype.render).not.toHaveBeenCalled();
    });

    _.each(['taskCollection', 'deadlineCount', 'appointmentCount', 'recommendationCount'], function(datum) {
      it('sets the ' + datum + ' #dashboardTopWidgetView #partialView #view #travis', function() {
        expect(view[datum]).toEqual(data[datum]);
      });
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('has ID #dashboard-top-widgets #dashboardTopWidgetView #partialView #view #travis', function() {
      expect(view.$el).toHaveId('dashboard-top-widgets');
    });

    ddescribe('task widget', function() {
      it('includes the task count #dashboardTopWidgetView #partialView #view #travis', function() {
        var num = data.taskCollection.length.toString();
        expect(view.$('div.dash-widget[data-name=tasks] div.huge').text()).toEqual(num);
      });

      it('doesn\'t include completed tasks', function() {
        data.taskCollection.push(new Tessitura.TaskModel({status: 'Complete'}));
        var num = (data.taskCollection.length - 1).toString();
        view.render();
        expect(view.$('div.dash-widget[data-name=tasks] div.huge').text()).toEqual(num);
      });

      it('includes blocking tasks', function() {
        data.taskCollection.models[0].set('status', 'Blocking');
        var num = data.taskCollection.length.toString();
        view.render();
        expect(view.$('div.dash-widget[data-name=tasks] div.huge').text()).toEqual(num);
      });

      it('doesn\'t include backlogged tasks', function() {
        data.taskCollection.models[0].set('backlog', true);
        var num = (data.taskCollection.length - 1).toString();
        view.render();
        expect(view.$('div.dash-widget[data-name=tasks] div.huge').text()).toEqual(num);
      })
    });

    describe('deadline widget', function() {
      it('includes the deadline count #dashboardTopWidgetView #partialView #view #travis', function() {
        expect(view.$('div.dash-widget[data-name=deadlines] div.huge')).toHaveText(data.deadlineCount);
      });
    });

    describe('appointment widget', function() {
      it('includes the appointment count #dashboardTopWidgetView #partialView #view #travis', function() {
        expect(view.$('div.dash-widget[data-name=appointments] div.huge')).toHaveText(data.appointmentCount);
      });
    });

    describe('recommendation widget', function() {
      it('includes the recommendations count #dashboardTopWidgetView #partialView #view #travis', function() {
        expect(view.$('div.dash-widget[data-name=recommendations] div.huge')).toHaveText(data.recommendationCount);
      });
    });
  });

  describe('events', function() {
    beforeEach(function() { 
      newView = new Tessitura.DashboardTopWidgetView(data);
      newView.render(); 
    });

    describe('add event on task collection', function() {
      it('calls render #dashboardTopWidgetView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardTopWidgetView.prototype, 'render');
        newView = new Tessitura.DashboardTopWidgetView(data);
        newView.taskCollection.create({title: 'foobar'});
        expect(Tessitura.DashboardTopWidgetView.prototype.render).toHaveBeenCalled();
      });
    });

    _.each(['add', 'remove'], function(event) {
      describe(event + ' event on task collection', function() {
        it('calls render #dashboardTopWidgetView #partialView #view #travis', function() {
          spyOn(Tessitura.DashboardTopWidgetView.prototype, 'render');
          newView = new Tessitura.DashboardTopWidgetView(data);
          newView.taskCollection.trigger(event);
          expect(Tessitura.DashboardTopWidgetView.prototype.render).toHaveBeenCalled();
        });
      });
    });
  }); 
});