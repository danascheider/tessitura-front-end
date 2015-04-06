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

var RegistrationForm = require(process.cwd() + '/js/views/partialViews/registrationFormView.js'),
    UserModel        = require(process.cwd() + '/js/models/userModel.js');

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

    it('has superFamily Backbone.View', function() {
      expect(form.superFamily).toBe('Backbone.View');
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      form.render();
    });

    it('is a form', function() {
      expect(form.$el).toHaveTag('form');
    });

    it('has ID #registration-form', function() {
      expect(form.$el).toHaveId('registrationForm');
    });

    describe('form fields', function() {
      _.each(['username', 'password', 'email', 'first_name', 'last_name', 'birthdate', 'fach', 'city', 'country'], function(field) {
        it('has a ' + field + ' field', function() {
          expect(form.$('input[name=' + field + ']')).toHaveLength(1);
        });
      });

      it('has a password confirmation field', function() {
        pending('Figure out how to fit the password confirmation field into the design');
      });

      it('has a captcha', function() {
        pending('Figure out how to fit the captcha into the design');
      });

      it('has a submit button', function() {
        expect(form.$('button[type=submit]')).toHaveLength(1);
      });

      describe('TOU checkbox', function() {
        it('exists', function() {
          expect(form.$('input[name="acceptTerms"]')).toExist();
        });

        it('is not checked by default', function() {
          expect(form.$('input[name="acceptTerms"]')).not.toBeChecked();
        });
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('createUser', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        form.on('userCreated', spy);

        spyOn(Canto.Utils, 'getAttributes').and.returnValue({
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User'
        });      

        e = $.Event('submit', {target: form.$el});
      });

      afterEach(function() { form.off('userCreated'); });

      it('doesn\'t refresh the page', function() {
        spyOn(e, 'preventDefault');
        form.createUser(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('instantiates a user model', function() {
        spyOn(UserModel.prototype, 'initialize');
        form.createUser(e);
        expect(UserModel.prototype.initialize).toHaveBeenCalled();
      });

      context('success', function() {
        it('emits the userCreated event', function() {
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
          expect(spy).toHaveBeenCalled();
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument \'RegistrationFormView\'', function() {
        expect(form.isA('RegistrationFormView')).toBe(true);
      });

      it('returns true with argument \'RegistrationForm\'', function() {
        expect(form.isA('RegistrationForm')).toBe(true);
      });

      it('returns true with argument \'FormView\'', function() {
        expect(form.isA('FormView')).toBe(true);
      });

      it('returns true with argument \'PartialView\'', function() {
        expect(form.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(form.isA('very model of a modern major general')).toBe(false);
      });
    });
  });

  describe('core view functions', function() {
    describe('render()', function() {
      it('calls render on the Canto View prototype', function() {
        spyOn(Canto.View.prototype.render, 'call');
        form.render();
        expect(Canto.View.prototype.render.call).toHaveBeenCalled();
        expect(Canto.View.prototype.render.call.calls.argsFor(0)).toContain(form);
      });
    });
  });
});