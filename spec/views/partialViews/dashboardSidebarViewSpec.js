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
    it('doesn\'t call render #travis', function() {
      spyOn(Canto.DashboardSidebarView.prototype, 'render');
      var newSidebar = new Canto.DashboardSidebarView();
      expect(Canto.DashboardSidebarView.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('properties', function() {
    it('is a Canto.View #travis', function() {
      expect(sidebar).toBeA('Canto.View');
    });

    it('has klass DashboardSidebarView #travis', function() {
      expect(sidebar.klass).toBe('DashboardSidebarView');
    });

    it('has family Canto.View #travis', function() {
      expect(sidebar.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View #travis', function() {
      expect(sidebar.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      sidebar.render();
    });

    it('is a ul #travis', function() {
      expect(sidebar.$el[0].tagName).toEqual('UL');
    });

    it('has class .nav #travis', function() {
      expect(sidebar.$el).toHaveClass('nav');
    });

    it('has ID #side-menu #travis', function() {
      expect(sidebar.$el).toHaveId('side-menu');
    });

    it('has a search field #travis', function() {
      expect(sidebar.$('.custom-search-form')).toExist();
    });

    it('has a link to the dashboard #travis', function() {
      expect(sidebar.$('.dashboard-link')).toExist();
    });

    it('has a link to the task page #travis', function() {
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
      it('calls toggleSecondLevelNav #travis', function() {
        newSidebar.$('a.sidebar-link').last().click();
        expect(Canto.DashboardSidebarView.prototype.toggleSecondLevelNav).toHaveBeenCalled();
      });
    });

    describe('click li > .dashboard-link', function() {
      it('calls goToDashboard #travis', function() {
        newSidebar.$('li > .dashboard-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToDashboard).toHaveBeenCalled();
      });
    });

    describe('click li > .task-page-link', function() {
      it('calls goToTaskPage #travis', function() {
        newSidebar.$('li > .task-page-link').first().click();
        expect(Canto.DashboardSidebarView.prototype.goToTaskPage).toHaveBeenCalled();
      });
    })
  });

  describe('event callbacks', function() {
    beforeEach(function() { sidebar.render(); });

    describe('goToDashboard', function() {
      it('triggers the redirect:dashboard event on the view #travis', function() {
        var spy = jasmine.createSpy();
        sidebar.on('redirect', spy);
        sidebar.goToDashboard();
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        sidebar.off('redirect');
      });
    });

    describe('goToTaskPage', function() {
      it('triggers the redirect:tasks event on the view #travis', function() {
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
        it('adds the `active` class to its parent #travis', function() {
          sidebar.toggleSecondLevelNav(e);
          expect(link.closest('li')).toHaveClass('active');
        });

        it('removes the `active` class from any other li\'s #travis', function() {
          sidebar.$('a[href=#]').last().closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('a[href=#]').last().closest('li')).not.toHaveClass('active');
        });
      });

      context('when the menu clicked is open', function() {
        it('removes the `active` class from all the menus #travis', function() {
          link.closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('li.active').length).toEqual(0);
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument DashboardSidebarView #travis', function() {
        expect(sidebar.isA('DashboardSidebarView')).toBe(true);
      });

      it('returns true with argument DashboardView #travis', function() {
        expect(sidebar.isA('DashboardView')).toBe(true);
      });

      it('returns true with argument PartialView #travis', function() {
        expect(sidebar.isA('PartialView')).toBe(true);
      });

      it('returns false with other argument #travis', function() {
        expect(sidebar.isA('Backbone.Router')).toBe(false);
      });
    });
  });
});