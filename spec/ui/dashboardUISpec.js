require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var context  = describe,
    fcontext = fdescribe;

describe('Dashboard View #ui', function() {
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
    it('does not display dropdowns by default #dashboard', function(done) {
      client.waitForVisible('#dashboard-wrapper ul.dropdown-menu', function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('displays dropdown menus whose parents have class .open #dashboard', function(done) {
      client.waitForVisible('a[data-method=hideDropdownMenus]')
            .click('a[data-method=hideDropdownMenus]')
            .click('a[data-method=toggleDropdownMenu]')
            .isVisible('.navbar-top-links > li.open > ul.dropdown-menu', function(err, isVisible) {
              
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('doesn\'t display its dropdown menu by default', function(done) {
      client.waitForVisible('#side-menu', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });
  });
});