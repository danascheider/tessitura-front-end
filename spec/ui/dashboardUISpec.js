require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var context  = describe,
    fcontext = fdescribe;

describe('Dashboard View', function() {
  beforeAll(function(done) {
    jasmine.addMatchers(require('jasmine-jquery-matchers'));
    client.init().url('http://localhost/#dashboardViewSpec', done);
  });

  beforeEach(function(done) {
    client.refresh(done);
  });

  afterAll(function(done) {
    client.end();
    done();
  });

  describe('elements', function() {
    it('does not display dropdowns by default #ui', function(done) {
      client.waitForVisible('#dashboard-wrapper ul.dropdown-menu', function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('displays dropdown menus whose parents have class .open #ui', function(done) {
      client.waitForVisible('a[data-method=hideDropdownMenus]')
            .click('a[data-method=hideDropdownMenus]')
            .click('a[data-method=toggleDropdownMenu]')
            .isVisible('.navbar-top-links > li.open > ul.dropdown-menu', function(err, isVisible) {
              
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('doesn\'t display its sidebar menu by default #ui', function(done) {
      client.waitForVisible('#side-menu', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });
  });

  describe('functions', function() {
    describe('toggleSidebar()', function() {
      context('when the sidebar is visible', function() {
        beforeEach(function(done) {
          client.waitForVisible('a[data-method=showSidebar]')
                .click('a[data-method=showSidebar]')
                .waitForVisible('#side-menu')
                .click('a[data-method=toggleSidebar]', done);
        });

        it('runs the before filter', function() {
          pending('Figure out how to test this');
        });
      });

      context('when the sidebar is hidden', function() {
        //
      });
    });

    describe('hideSidebar()', function() {
      it('hides the sidebar #ui', function(done) {
        client.waitForVisible('a[data-method=showSidebar]')
              .click('a[data-method=showSidebar]')
              .waitForVisible('#side-menu')
              .click('a[data-method=hideSidebar]')
              .waitForVisible('.sidebar-collapse', true, function(err, isVisible) {
          expect(isVisible).toBe(false);
          done();
        });
      });
    });
  });
});