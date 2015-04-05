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
    it('does not display dropdowns by default #dashboard #ui', function(done) {
      client.waitForVisible('#dashboard-wrapper ul.dropdown-menu', function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('displays dropdown menus whose parents have class .open #dashboard #ui', function(done) {
      client.waitForVisible('a[data-method=toggleDropdownMenu]')
            .click('a[data-method=toggleDropdownMenu]')
            .waitForVisible('#dashboard-wrapper li.dropdown.open', function(err, isVisible) {

        expect(isVisible).toBe(true);
        done();
      });
    });
  });
});