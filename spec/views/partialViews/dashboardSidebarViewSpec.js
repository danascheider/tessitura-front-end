require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var SUT = require(process.cwd() + '/js/views/partialViews/dashboardSidebarView.js');

var matchers       = require('jasmine-jquery-matchers'),
    toBeA          = require(process.cwd() + '/spec/support/matchers/toBeA'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

Backbone.$         = $;

describe('Dashboard Sidebar View #travis', function() {
  var sidebar, e, link;

  beforeEach(function() {
    jasmine.addMatchers(matchers);
    jasmine.addMatchers(toBeA);
    sidebar = new SUT();
  });

  afterAll(function() {
    sidebar.remove();
    sidebar = null;
  });

  describe('constructor', function() {
    it('doesn\'t call render', function() {
      spyOn(SUT.prototype, 'render');
      var newSidebar = new SUT();
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('properties', function() {
    it('is a Canto.View', function() {
      expect(sidebar).toBeA('Canto.View');
    });

    it('has klass DashboardSidebarView', function() {
      expect(sidebar.klass).toBe('DashboardSidebarView');
    });

    it('has family Canto.View', function() {
      expect(sidebar.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(sidebar.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      sidebar.render();
    });

    it('is a ul', function() {
      expect(sidebar.$el[0].tagName).toEqual('UL');
    });

    it('has class .nav', function() {
      expect(sidebar.$el).toHaveClass('nav');
    });

    it('has ID #side-menu', function() {
      expect(sidebar.$el).toHaveId('side-menu');
    });

    it('has a search field', function() {
      expect(sidebar.$('.custom-search-form')).toExist();
    });

    it('has a link to the dashboard', function() {
      expect(sidebar.$('.dashboard-link')).toExist();
    });

    it('has a link to the task page', function() {
      expect(sidebar.$('.task-page-link')).toExist();
    });
  });

  describe('events', function() {
    var newSidebar;

    beforeEach(function() { 
      spyOn(SUT.prototype, 'toggleSecondLevelNav');
      spyOn(SUT.prototype, 'goToDashboard');
      spyOn(SUT.prototype, 'goToTaskPage');
      newSidebar = new SUT();
      newSidebar.render();
    });

    describe('click sidebar link', function() {
      it('calls toggleSecondLevelNav', function() {
        newSidebar.$('a.sidebar-link').last().click();
        expect(SUT.prototype.toggleSecondLevelNav).toHaveBeenCalled();
      });
    });

    describe('click li > .dashboard-link', function() {
      it('calls goToDashboard', function() {
        newSidebar.$('li > .dashboard-link').first().click();
        expect(SUT.prototype.goToDashboard).toHaveBeenCalled();
      });
    });

    describe('click li > .task-page-link', function() {
      it('calls goToTaskPage', function() {
        newSidebar.$('li > .task-page-link').first().click();
        expect(SUT.prototype.goToTaskPage).toHaveBeenCalled();
      });
    })
  });

  describe('event callbacks', function() {
    beforeEach(function() { sidebar.render(); });

    describe('goToDashboard', function() {
      it('triggers the redirect:dashboard event on the view', function() {
        var spy = jasmine.createSpy();
        sidebar.on('redirect', spy);
        sidebar.goToDashboard();
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        sidebar.off('redirect');
      });
    });

    describe('goToTaskPage', function() {
      it('triggers the redirect:tasks event on the view', function() {
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
        it('adds the `active` class to its parent', function() {
          sidebar.toggleSecondLevelNav(e);
          expect(link.closest('li')).toHaveClass('active');
        });

        it('removes the `active` class from any other li\'s', function() {
          sidebar.$('a[href=#]').last().closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('a[href=#]').last().closest('li')).not.toHaveClass('active');
        });
      });

      context('when the menu clicked is open', function() {
        it('removes the `active` class from all the menus', function() {
          link.closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('li.active').length).toEqual(0);
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument DashboardSidebarView', function() {
        expect(sidebar.isA('DashboardSidebarView')).toBe(true);
      });

      it('returns true with argument DashboardView', function() {
        expect(sidebar.isA('DashboardView')).toBe(true);
      });

      it('returns true with argument PartialView', function() {
        expect(sidebar.isA('PartialView')).toBe(true);
      });

      it('returns false with other argument', function() {
        expect(sidebar.isA('Backbone.Router')).toBe(false);
      });
    });
  });
});