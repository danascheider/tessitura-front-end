require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    Fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

describe('Dashboard Top Widget View', function() {
  var view, data, e, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, Fixtures);

    data = {
      taskCollection: collection,
      deadlineCount: 6,
      appointmentCount: 2,
      recommendationCount: 12
    };
  });

  beforeEach(function() {
    view = new Canto.DashboardTopWidgetView(data);
  });

  afterEach(function() { 
    view.remove();
    restoreFixtures();
  });

  afterAll(function() {
    view = null;
    global = _.omit(global, Fixtures);
  });

  describe('constructor', function() {
    it('#travis doesn\'t call render', function() {
      spyOn(Canto.DashboardTopWidgetView.prototype, 'render');
      var newView = new Canto.DashboardTopWidgetView(data);
      expect(Canto.DashboardTopWidgetView.prototype.render).not.toHaveBeenCalled();
    });

    _.each(['taskCollection', 'deadlineCount', 'appointmentCount', 'recommendationCount'], function(datum) {
      it('#travis sets the ' + datum, function() {
        expect(view[datum]).toEqual(data[datum]);
      });
    });
  });

  describe('properties', function() {
    it('#travis has klass DashboardTopWidgetView', function() {
      expect(view.klass).toBe('DashboardTopWidgetView');
    });

    it('#travis has family Canto.View', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('#travis has ID #dashboard-top-widgets', function() {
      expect(view.$el).toHaveId('dashboard-top-widgets');
    });

    describe('task widget', function() {
      it('#travis includes the task count', function() {
        expect(view.$('div.dash-widget[data-name=tasks] div.huge')).toHaveText(data.taskCollection.length);
      });
    });

    describe('deadline widget', function() {
      it('#travis includes the deadline count', function() {
        expect(view.$('div.dash-widget[data-name=deadlines] div.huge')).toHaveText(data.deadlineCount);
      });
    });

    describe('appointment widget', function() {
      it('#travis includes the appointment count', function() {
        expect(view.$('div.dash-widget[data-name=appointments] div.huge')).toHaveText(data.appointmentCount);
      });
    });

    describe('recommendation widget', function() {
      it('#travis includes the recommendations count', function() {
        expect(view.$('div.dash-widget[data-name=recommendations] div.huge')).toHaveText(data.recommendationCount);
      });
    });
  });

  describe('events', function() {
    beforeEach(function() { 
      spyOn(Canto.DashboardTopWidgetView.prototype, 'followLink');
      newView = new Canto.DashboardTopWidgetView(data);
      newView.render(); 
    });

    describe('click .dash-widget', function() {
      it('#travis calls followLink', function() {
        newView.$('.dash-widget').first().click();
        expect(Canto.DashboardTopWidgetView.prototype.followLink).toHaveBeenCalled();
      });
    });

    _.each(['add', 'remove'], function(event) {
      describe(event + ' event on task collection', function() {
        it('#travis calls render', function() {
          spyOn(Canto.DashboardTopWidgetView.prototype, 'render');
          newView = new Canto.DashboardTopWidgetView(data);
          newView.taskCollection.trigger(event);
          expect(Canto.DashboardTopWidgetView.prototype.render).toHaveBeenCalled();
        });
      });
    });
  });

  describe('event callbacks', function() {
    beforeEach(function() { view.render(); });

    describe('followLink()', function() {
      it('#travis triggers a redirect event on the view', function() {
        e = $.Event('click', {target: view.$('.dash-widget[data-name=tasks]').first()});
        var spy = jasmine.createSpy();
        view.on('redirect', spy);
        view.followLink(e);
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
        view.off('redirect');
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('#travis returns true with arg DashboardTopWidgetView', function() {
        expect(view.isA('DashboardTopWidgetView')).toBe(true);
      });

      it('#travis returns true with arg PartialView', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(view.isA('dachshund')).toBe(false);
      });
    });
  });
});