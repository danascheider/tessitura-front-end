require(process.cwd() + '/js/dependencies.js');

require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var matchers = require('jasmine-jquery-matchers'),
    context  = describe,
    fcontext = fdescribe;

describe('Task Collection View Elements', function() {
  beforeAll(function() {
    jasmine.addMatchers(matchers);
    client.init().url('http://localhost/#taskCollectionViewSpec');
  });

  beforeEach(function(done) {
    client.refresh(done);
  });

  afterAll(function(done) {
    client.end(done);
  });

  it('displays its quick-add form', function(done) {
    client.waitForVisible('#view .quick-add-form', function(err, isVisible) {
      expect(isVisible).toBe(true);
      done();
    });
  });

  describe('crossOff', function() {
    context('when the task is complete', function() {
      beforeEach(function(done) {
        client.waitForVisible('#triggers a[data-method=crossOffComplete]')
              .click('#triggers a[data-method=crossOffComplete]', done);
      });

      it('adds a strikethrough to the title', function(done) {
        client.getCssProperty('li#task-3 a.task-title', 'text-decoration', function(err, res) {
          expect(res.value).toEqual('line-through');
          done();
        });
      });

      it('doesn\'t immediately remove the item from the list', function(done) {
        client.isVisible('li#task-3', function(err, isVisible) {
          expect(isVisible).toBe(true);
          done();
        });
      });

      it('does eventually remove the item from the list', function(done) {
        client.waitForVisible('li#task-3', 800, true, function(err, isVisible) {
          expect(isVisible).toBe(false);
          done()
        });
      });
    });

    context('when the task is incomplete', function() {
      beforeEach(function(done) {
        client.waitForVisible('a[data-method=crossOffIncomplete]')
              .click('a[data-method=crossOffIncomplete', done);
      });

      it('does not cross out the title', function(done) {
        client.getCssProperty('li#task-1 a.task-title', 'text-decoration', function(err, res) {
          expect(res.value).not.toEqual('line-through');
          done();
        });
      });

      it('does not eventually remove the item from the list', function(done) {
        client.waitForVisible('li#task-3', 800, function(err, isVisible) {
          expect(isVisible).toBe(true);
          done()
        });
      });
    });
  });
});