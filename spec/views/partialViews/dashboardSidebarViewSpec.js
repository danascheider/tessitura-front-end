require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

describe('Dashboard Sidebar View', function() {
  var sidebar, newSidebar, e, link;

  beforeAll(function()  { jasmine.addMatchers(matchers); });
  beforeEach(function() { sidebar = new Canto.DashboardSidebarView(); });
  afterEach(function()  { 
    sidebar.destroy(); 
    newSidebar && newSidebar.destroy();
  });
  afterAll(function()   { sidebar = null; });

  describe('constructor', function() {
    it('doesn\'t call render #partialView #view #travis', function() {
      spyOn(Canto.DashboardSidebarView.prototype, 'render');
      newSidebar = new Canto.DashboardSidebarView();
      expect(Canto.DashboardSidebarView.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('properties', function() {
    it('is a Canto.View #partialView #view #travis', function() {
      expect(sidebar).toBeA('Canto.View');
    });

    it('has klass DashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.klass).toBe('DashboardSidebarView');
    });

    it('has family Canto.View #partialView #view #travis', function() {
      expect(sidebar.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(sidebar.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      sidebar.render();
    });

    it('is a ul #partialView #view #travis', function() {
      expect(sidebar.$el[0].tagName).toEqual('UL');
    });

    it('has class .nav #partialView #view #travis', function() {
      expect(sidebar.$el).toHaveClass('nav');
    });

    it('has ID #side-menu #partialView #view #travis', function() {
      expect(sidebar.$el).toHaveId('side-menu');
    });

    it('has a search field #partialView #view #travis', function() {
      expect(sidebar.$('.custom-search-form')).toExist();
    });

    it('has a link to the dashboard #partialView #view #travis', function() {
      expect(sidebar.$('.dashboard-link')).toExist();
    });

    it('has a link to the task page #partialView #view #travis', function() {
      expect(sidebar.$('.task-page-link')).toExist();
    });
  });

  describe('events', function() {
    newSidebar;

    beforeEach(function() { 
      _.each(['toggleSecondLevelNav', 'goToTaskPage', 'goToDashboard'], function(method) { spyOn(Canto.DashboardSidebarView.prototype, method); });
      newSidebar = new Canto.DashboardSidebarView();
      newSidebar.render();
    });

    describe('click sidebar link', function() {
      it('calls toggleSecondLevelNav #partialView #view #travis', function() {
        newSidebar.$('a.sidebar-link').last().click();
        expect(Canto.DashboardSidebarView.prototype.toggleSecondLevelNav).toHaveBeenCalled();
      });
    });

    describe('click li > .dashboard-link', function() {
      it('calls goToDashboard #partialView #view #travis', function() {
        newSidebar.$('li > .dashboard-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToDashboard).toHaveBeenCalled();
      });
    });

    describe('click li > .task-page-link', function() {
      it('calls goToTaskPage #partialView #view #travis', function() {
        newSidebar.$('li > .task-page-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToTaskPage).toHaveBeenCalled();
      });
    })
  });

  describe('event callbacks', function() {
    beforeEach(function() { sidebar.render(); });

    describe('goToDashboard', function() {
      it('triggers the redirect:dashboard event on the view #partialView #view #travis', function() {
        var spy = jasmine.createSpy();
        sidebar.on('redirect', spy);
        sidebar.goToDashboard();
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        sidebar.off('redirect');
      });
    });

    describe('goToTaskPage', function() {
      it('triggers the redirect:tasks event on the view #partialView #view #travis', function() {
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
        it('adds the `active` class to its parent #partialView #view #travis', function() {
          sidebar.toggleSecondLevelNav(e);
          expect(link.closest('li')).toHaveClass('active');
        });

        it('removes the `active` class from any other li\'s #partialView #view #travis', function() {
          sidebar.$('a[href=#]').last().closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('a[href=#]').last().closest('li')).not.toHaveClass('active');
        });
      });

      context('when the menu clicked is open', function() {
        it('removes the `active` class from all the menus #partialView #view #travis', function() {
          link.closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('li.active').length).toEqual(0);
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument DashboardSidebarView #partialView #view #travis', function() {
        expect(sidebar.isA('DashboardSidebarView')).toBe(true);
      });

      it('returns true with argument DashboardView #partialView #view #travis', function() {
        expect(sidebar.isA('DashboardView')).toBe(true);
      });

      it('returns true with argument PartialView #partialView #view #travis', function() {
        expect(sidebar.isA('PartialView')).toBe(true);
      });

      it('returns false with other argument #partialView #view #travis', function() {
        expect(sidebar.isA('Backbone.Router')).toBe(false);
      });
    });
  });
});