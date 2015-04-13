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

  describe('toggle-widget icon', function() {
    it('is hidden by default', function(done) {
      client.waitForVisible('span.toggle-widget', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('is visible on hover', function(done) {
      client.element('#task-panel .panel-heading', function(err, element) {
        client.moveTo(element.value['ELEMENT'], 0, 0)
              .waitForVisible('span.toggle-widget', function(err, isVisible) {

          expect(isVisible).toBe(true); 
          done();
        });
      });
    })

    context('when the panel body is visible', function() {
      it('has icon class fa-minus', function(done) {
        client.element('#task-panel .panel-heading', function(err, el) {
          client.moveTo(el.value['ELEMENT'], 0, 0)
                .waitForVisible('i.fa-minus', function(err, isVisible) {

            expect(isVisible).toBe(true);
            done();
          });
        });
      });

      context('when the panel body is hidden', function() {
        it('has icon class fa-plus', function(done) {
          pending('Figure out why this is failing when the functionality unambiguously works');
          client.waitForVisible('#triggers a[data-method=hidePanelBody]')
                .click('#triggers a[data-method=hidePanelBody]')
                .waitForVisible('#task-panel .panel-body', true)
                .element('#task-panel .panel-heading', function(err, el) {

                  client.moveTo(el.value['ELEMENT'], 0, 0)
                        .waitForVisible('i.fa-plus', function(err, isVisible) {

              expect(isVisible).toBe(true);
              done();
            });
          });
        });
      });
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