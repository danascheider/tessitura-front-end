require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var matchers = require('jasmine-jquery-matchers'),
    context  = describe,
    fcontext = fdescribe;

describe('Task List Item View', function() {
  beforeAll(function(done) {
    jasmine.addMatchers(matchers);
    client.init().url('http://localhost/#listItemViewSpec', done);
  });

  beforeEach(function(done) {
    client.refresh(done);
  });

  afterAll(function(done) {
    client.end(done);
  });

  describe('view elements', function() {
    it('displays the mark-complete checkbox #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 i[title="Mark complete"]', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('displays the task model #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 div.task-model', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('doesn\'t display the task details by default #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 .task-details', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('doesn\'t display the edit icon by default #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 i[title=Edit]', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('doesn\'t display the delete icon by default #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 i[title=Delete]', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });

    it('doesn\'t display the backlog icon by default #listItemUI #ui', function(done) {
      client.waitForVisible('li#task-1 i[title=Backlog]', true, function(err, isVisible) {
        expect(isVisible).toBe(false);
        done();
      });
    });
  });

  describe('callbacks', function() {
    describe('hideEditForm', function() {
      context('when the edit form is not visible', function() {
        it('doesn\'t toggle the form #listItemUI #ui', function() {
          pending('Define the edit form view');
        });
      });

      context('when the edit form is visible', function() {
        it('hides the form #listItemUI #ui', function() {
          pending('Define the edit form view');
        });
      });
    });

    describe('markComplete', function() {
      beforeEach(function() {
        client.click('#triggers a[data-method=markComplete]')
      });

      it('checks the checkbox #listItemUI #ui', function() {
        client.getAttribute('i[title="Mark complete"]', 'class', function(err, klass) {
          expect(klass).toMatch(/fa\-check\-square\-o/);
        });
      });

      it('doesn\'t show the unchecked checkbox icon #listItemUI #ui', function() {
        client.element('i.fa-check-square-o', function(err, res) {
          expect('i.fa-check-square-o').not.toHaveClass('fa-square-o');
        });
      });
    });

    describe('toggleTaskDetails', function() {
      context('when the details are hidden', function() {
        it('shows the details #listItemUI #ui', function(done) {
          pending('Fails because it has to scroll to see the details. FIX this');

          client.click('#triggers a[data-method=toggleTaskDetails]')
                .waitForVisible('.task-details', function(err, isVisible) {

            expect(isVisible).toBe(true);
            done();
          });
        });
      });

      context('when the details are visible', function() {
        it('hides the details #listItemUI #ui', function(done) {
          pending('Fails because it has to scroll to see the details. FIX this');
          
          client.click('#triggers a[data-method=toggleTaskDetails]')
                .waitFor('.task-details')
                .click('#triggers a[data-method=toggleTaskDetails]')
                .waitForVisible('.task-details', true, function(err, isVisible) {

            expect(isVisible).not.toBe(true);
            done();
          });
        });
      });
    });
  });
});