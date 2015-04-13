require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

describe('Dashboard Sidebar View', function() {
  var sidebar, e, link;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  })

  beforeEach(function() {
    sidebar = new Canto.DashboardSidebarView();
  });

  afterEach(function() { sidebar.remove(); });
  afterAll(function() { sidebar = null; });

  describe('constructor', function() {
    it('#travis doesn\'t call render', function() {
      spyOn(Canto.DashboardSidebarView.prototype, 'render');
      var newSidebar = new Canto.DashboardSidebarView();
      expect(Canto.DashboardSidebarView.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('properties', function() {
    it('#travis is a Canto.View', function() {
      expect(sidebar).toBeA('Canto.View');
    });

    it('#travis has klass DashboardSidebarView', function() {
      expect(sidebar.klass).toBe('DashboardSidebarView');
    });

    it('#travis has family Canto.View', function() {
      expect(sidebar.family).toBe('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(sidebar.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      sidebar.render();
    });

    it('#travis is a ul', function() {
      expect(sidebar.$el[0].tagName).toEqual('UL');
    });

    it('#travis has class .nav', function() {
      expect(sidebar.$el).toHaveClass('nav');
    });

    it('#travis has ID #side-menu', function() {
      expect(sidebar.$el).toHaveId('side-menu');
    });

    it('#travis has a search field', function() {
      expect(sidebar.$('.custom-search-form')).toExist();
    });

    it('#travis has a link to the dashboard', function() {
      expect(sidebar.$('.dashboard-link')).toExist();
    });

    it('#travis has a link to the task page', function() {
      expect(sidebar.$('.task-page-link')).toExist();
    });
  });

  describe('events', function() {
    var newSidebar;

    beforeEach(function() { 
      spyOn(Canto.DashboardSidebarView.prototype, 'toggleSecondLevelNav');
      spyOn(Canto.DashboardSidebarView.prototype, 'goToDashboard');
      spyOn(Canto.DashboardSidebarView.prototype, 'goToTaskPage');
      newSidebar = new Canto.DashboardSidebarView();
      newSidebar.render();
    });

    describe('click sidebar link', function() {
      it('#travis calls toggleSecondLevelNav', function() {
        newSidebar.$('a.sidebar-link').last().click();
        expect(Canto.DashboardSidebarView.prototype.toggleSecondLevelNav).toHaveBeenCalled();
      });
    });

    describe('click li > .dashboard-link', function() {
      it('#travis calls goToDashboard', function() {
        newSidebar.$('li > .dashboard-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToDashboard).toHaveBeenCalled();
      });
    });

    describe('click li > .task-page-link', function() {
      it('#travis calls goToTaskPage', function() {
        newSidebar.$('li > .task-page-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToTaskPage).toHaveBeenCalled();
      });
    })
  });

  describe('event callbacks', function() {
    beforeEach(function() { sidebar.render(); });

    describe('goToDashboard', function() {
      it('#travis triggers the redirect:dashboard event on the view', function() {
        var spy = jasmine.createSpy();
        sidebar.on('redirect', spy);
        sidebar.goToDashboard();
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        sidebar.off('redirect');
      });
    });

    describe('goToTaskPage', function() {
      it('#travis triggers the redirect:tasks event on the view', function() {
        var spy = jasmine.createSpy();
        sidebar.on('redirect', spy);
        sidebar.goToTaskPage();
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
        sidebar.off('redirect');
      });
    });

    describe('toggleSecondLevelNav', function() {
      beforeEach(function() {
        link = sidebar.$('a[href=#]').first();
        e = $.Event('click', {target: link});
      });

      context('when the menu clicked is closed', function() {
        it('#travis adds the `active` class to its parent', function() {
          sidebar.toggleSecondLevelNav(e);
          expect(link.closest('li')).toHaveClass('active');
        });

        it('#travis removes the `active` class from any other li\'s', function() {
          sidebar.$('a[href=#]').last().closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('a[href=#]').last().closest('li')).not.toHaveClass('active');
        });
      });

      context('when the menu clicked is open', function() {
        it('#travis removes the `active` class from all the menus', function() {
          link.closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('li.active').length).toEqual(0);
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('#travis returns true with argument DashboardSidebarView', function() {
        expect(sidebar.isA('DashboardSidebarView')).toBe(true);
      });

      it('#travis returns true with argument DashboardView', function() {
        expect(sidebar.isA('DashboardView')).toBe(true);
      });

      it('#travis returns true with argument PartialView', function() {
        expect(sidebar.isA('PartialView')).toBe(true);
      });

      it('#travis returns false with other argument', function() {
        expect(sidebar.isA('Backbone.Router')).toBe(false);
      });
    });
  });
});