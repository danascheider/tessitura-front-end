/***************************************************************************
 *                                                                         *
 * REGISTRATION FORM VIEW                                                  *
 *                                                                         *
 * The registration form is displayed on the homepage when the user        *
 * clicks the "sign up" link or scrolls to its location. It provides       *  
 * fields for them to sign up and validates they have entered the          *
 * required information and indicated they accept the terms of use.        *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 26   *
 * Suite ............................................................ 44   *
 *   Filters ........................................................ 50   *
 *   Static Properties .............................................. 60   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/****************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    matchers       = _.extend(require('jasmine-jquery-matchers')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var RegistrationForm = require(process.cwd() + '/js/views/partialViews/registrationFormView.js');

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Registration Form View #travis', function() {
  var form, e, spy, xhr;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    form = new RegistrationForm();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    form.remove();
    form = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('static properties', function() {
    it('has klass RegistrationFormView', function() {
      expect(form.klass).toBe('RegistrationFormView');
    });

    it('has family Canto.View', function() {
      expect(form.family).toBe('Canto.View');
    });
  });
});