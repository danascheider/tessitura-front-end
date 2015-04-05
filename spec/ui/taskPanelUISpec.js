require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/spec/support/env.js');

var matchers = require('jasmine-jquery-matchers'),
    context  = describe,
    fcontext = fdescribe;

describe('Task Panel View Elements #ui', function() {
  beforeAll(function(done) {
    jasmine.addMatchers(matchers);
    client.init().url('http://localhost/#taskPanelViewSpec', done);
  });

  beforeEach(function(done) {
    client.refresh();
    done();
  });

  afterAll(function(done) {
    client.end();
    done();
  });

  describe('hideToggleWidgetIcon', function() {
    beforeEach(function(done) {
      client.waitForVisible('a[data-method=displayIcon]')
            .click('a[data-method=displayIcon]', done);
    });

    it('hides the toggle-widget icon', function(done) {
      client.waitForVisible('a[data-method=hideToggleWidgetIcon]')
            .click('a[data-method=hideToggleWidgetIcon]')
            .waitForVisible('#task-panel i.toggle-widget', function(err, isVisible) {
        
        expect(isVisible).toBe(false);
        done();
      });
    });
  });

  describe('hideWidget', function() {
    beforeEach(function(done) {
      client.waitForVisible('#task-panel .panel-body', done)
    });

    it('hides the panel body', function(done) {
      client.click('#triggers a[data-method=hideWidget]')
            .waitForVisible('#task-panel .panel-body', 1500, true) 
            .selectorExecute('#task-panel .panel-body', function(panelBody) {
          
        expect(panelBody).not.toBeVisible();
      }, done);
    });
  });

  describe('showToggleWidgetIcon', function() {
    it('shows the toggle-widget icon', function(done) {
      client.waitForVisible('a[data-method=showToggleWidgetIcon]')
            .click('a[data-method=showToggleWidgetIcon]')
            .waitForVisible('#task-panel .hide-widget', 5000)
            .selectorExecute('#task-panel .hide-widget', function(icon) {

        expect(icon).toBeVisible();
      }, done);
    });
  });

  describe('showWidget', function() {
    beforeEach(function(done) {
      client.waitForVisible('a[data-method=hidePanelBody]')
            .click('a[data-method=hidePanelBody]')
            .waitForVisible('#task-panel .panel-body', 1500, true, done)
    });

    it('shows the panel body', function(done) {
      client.click('a[data-method=showWidget]')
            .waitForVisible('#task-panel .panel-body', 1500)
            .selectorExecute('#task-panel .panel-body', function(panelBody) {

        expect(panelBody).toBeVisible();
      }, done);
    });
  });

  describe('remove', function() {
    it('hides itself', function(done) {
      client.waitForVisible('a[data-method=remove]')
            .click('a[data-method=remove]')
            .waitForVisible('#task-panel', true, function(err, isVisible) {

        expect(isVisible).toBe(false);
        done();
      });
    });
  });
});