/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    ccontext       = ddescribe;

/* Dashboard Sidebar View Spec
/****************************************************************************************/

/* istanbul ignore next */
describe('Dashboard Sidebar View', function() {
  var sidebar, newSidebar, e, link;

  beforeEach(function() { 
    this.addMatchers(matchers);
    sidebar = new Tessitura.DashboardSidebarView(); 
  });

  afterEach(function()  { 
    sidebar.destroy(); 
    newSidebar && newSidebar.destroy();
  });

  describe('constructor', function() {
    it('doesn\'t call render #dashboardSidebarView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardSidebarView.prototype, 'render');
      newSidebar = new Tessitura.DashboardSidebarView();
      expect(Tessitura.DashboardSidebarView.prototype.render).not.toHaveBeenCalled();
    });
  });
  
  describe('elements', function() {
    beforeEach(function() {
      sidebar.render();
    });

    it('is a ul #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$el[0].tagName).toEqual('UL');
    });

    it('has class .nav #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$el).toHaveClass('nav');
    });

    it('has ID #side-menu #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$el).toHaveId('side-menu');
    });

    it('has a search field #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$('.custom-search-form')).toExist();
    });

    it('has a link to the dashboard #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$('.dashboard-link')).toExist();
    });

    it('has a link to the task page #dashboardSidebarView #partialView #view #travis', function() {
      expect(sidebar.$('.task-page-link')).toExist();
    });
  });

  describe('events', function() {
    newSidebar;

    beforeEach(function() { 
      spyOn(Tessitura.DashboardSidebarView.prototype, 'toggleSecondLevelNav');
      newSidebar = new Tessitura.DashboardSidebarView();
      newSidebar.render();
    });

    describe('click sidebar link', function() {
      it('calls toggleSecondLevelNav #dashboardSidebarView #partialView #view #travis', function() {
        newSidebar.$('a.sidebar-link').last().click();
        expect(Tessitura.DashboardSidebarView.prototype.toggleSecondLevelNav).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    beforeEach(function() { sidebar.render(); });
    
    describe('toggleSecondLevelNav', function() {
      beforeEach(function() {
        link = sidebar.$('a[href=#]').first();
        e = $.Event('click', {target: link});
      });

      context('when the menu clicked is closed', function() {
        it('adds the `active` class to its parent #dashboardSidebarView #partialView #view #travis', function() {
          sidebar.toggleSecondLevelNav(e);
          expect(link.closest('li')).toHaveClass('active');
        });

        it('removes the `active` class from any other li\'s #dashboardSidebarView #partialView #view #travis', function() {
          sidebar.$('a[href=#]').last().closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('a[href=#]').last().closest('li')).not.toHaveClass('active');
        });
      });

      context('when the menu clicked is open', function() {
        it('removes the `active` class from all the menus #dashboardSidebarView #partialView #view #travis', function() {
          link.closest('li').addClass('active');
          sidebar.toggleSecondLevelNav(e);
          expect(sidebar.$('li.active').length).toEqual(0);
        });
      });
    });
  });
});