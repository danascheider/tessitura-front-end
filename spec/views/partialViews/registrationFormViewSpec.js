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

require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Registration Form View', function() {
  var form, e, spy, obj;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    form = new Canto.RegistrationFormView();
  });

  afterEach(function() {
    form.remove();
    restoreFixtures();
  });

  afterAll(function() {
    form = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('static properties', function() {
    it('#travis has klass RegistrationFormView', function() {
      expect(form.klass).toBe('RegistrationFormView');
    });

    it('#travis has family Canto.View', function() {
      expect(form.family).toBe('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(form.superFamily).toBe('Backbone.View');
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      form.render();
    });

    it('#travis is a form', function() {
      expect(form.$el).toHaveTag('form');
    });

    it('#travis has ID #registration-form', function() {
      expect(form.$el).toHaveId('registration-form');
    });

    describe('form fields', function() {
      _.each(['username', 'password', 'email', 'first_name', 'last_name', 'birthdate', 'fach', 'city', 'country'], function(field) {
        it('#travis has a ' + field + ' field', function() {
          expect(form.$('input[name=' + field + ']')).toHaveLength(1);
        });
      });

      it('#travis has a password confirmation field', function() {
        pending('Figure out how to fit the password confirmation field into the design');
      });

      it('#travis has a captcha', function() {
        pending('Figure out how to fit the captcha into the design');
      });

      it('#travis has a submit button', function() {
        expect(form.$('button[type=submit]')).toHaveLength(1);
      });

      describe('TOU checkbox', function() {
        it('#travis exists', function() {
          expect(form.$('input[name="acceptTerms"]')).toExist();
        });

        it('#travis is not checked by default', function() {
          expect(form.$('input[name="acceptTerms"]')).not.toBeChecked();
        });
      });
    });
  });

  /* View Events
  /**************************************************************************/

  describe('view events', function() {
    describe('submit', function() {
      it('#travis calls createUser', function() {
        spyOn(Canto.RegistrationFormView.prototype, 'createUser');
        var newForm = new Canto.RegistrationFormView();
        newForm.$el.submit();
        expect(Canto.RegistrationFormView.prototype.createUser).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('createUser', function() {
      beforeEach(function() {
        obj = {
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User', acceptTerms: true
        };

        spyOn(Canto.Utils, 'getAttributes').and.returnValue(obj);      

        e = $.Event('submit', {target: form.$el});
      });

      afterEach(function() { form.off('userCreated'); });

      it('#travis doesn\'t refresh the page', function() {
        spyOn(e, 'preventDefault').and.callThrough();
        form.createUser(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('#travis instantiates a user model', function() {
        spyOn(Canto.UserModel.prototype, 'initialize');
        form.createUser(e);
        expect(Canto.UserModel.prototype.initialize).toHaveBeenCalled();
      });

      it('#travis calls validateForm', function() {
        spyOn(form, 'validateForm');
        form.createUser(e);
        expect(form.validateForm).toHaveBeenCalled();
      });

      it('#travis calls save on the user', function() {
        spyOn(Canto.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Canto.UserModel.prototype.save).toHaveBeenCalled();
      });

      it('#travis uses the attributes from the form', function() {
        spyOn(Canto.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Canto.UserModel.prototype.save.calls.argsFor(0)).toContain(obj)
      });

      context('invalid form', function() {
        beforeEach(function() {
          spyOn(form, 'validateForm').and.returnValue(false);
        });

        it('#travis doesn\'t create a user', function() {
          spyOn(Canto.UserModel.prototype, 'initialize');
          form.createUser(e);
          expect(Canto.UserModel.prototype.initialize).not.toHaveBeenCalled();
        });

        it('#travis doesn\'t trigger userCreated', function() {
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
          expect(spy).not.toHaveBeenCalled();
          form.off('userCreated');
        });
      });

      context('success', function() {
        beforeEach(function() {
          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          form.on('userCreated', spy);

          spyOn($, 'ajax').and.callFake(function(args) {
            args.success({
              id: 245, username: 'testuser245', password: '245usertest', 
              email: 'tu245@example.org', first_name: 'Test', last_name: 'User'
            });
          });

          form.createUser(e);
        });

        afterEach(function() { form.off('userCreated'); });

        it('#travis sets the auth cookie as a session cookie', function(done) {
          expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser245:245usertest'));
          done();
        });

        it('#travis sets the userID cookie as a session cookie', function(done) {
          expect($.cookie).toHaveBeenCalledWith('userID', 245);
          done();
        });

        it('#travis emits the userCreated event', function(done) {
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
          expect(spy).toHaveBeenCalled();
          done();
        });
      });

      context('failure', function() {
        beforeEach(function() {
          spyOn($, 'ajax').and.callFake(function(args) {
            args.error();
          });

          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
        });

        afterEach(function() { form.off('userCreated'); });

        it('#travis doesn\'t set cookies', function(done) {
          expect($.cookie).not.toHaveBeenCalled();
          done();
        });

        it('#travis doesn\'t trigger \'userCreated\'', function(done) {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA', function() {
      it('#travis returns true with argument \'RegistrationFormView\'', function() {
        expect(form.isA('RegistrationFormView')).toBe(true);
      });

      it('#travis returns true with argument \'RegistrationForm\'', function() {
        expect(form.isA('RegistrationForm')).toBe(true);
      });

      it('#travis returns true with argument \'FormView\'', function() {
        expect(form.isA('FormView')).toBe(true);
      });

      it('#travis returns true with argument \'PartialView\'', function() {
        expect(form.isA('PartialView')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(form.isA('very model of a modern major general')).toBe(false);
      });
    });

    describe('validateForm', function() {
      var formData;

      beforeEach(function() {
        formData = {
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User', acceptTerms: true
        }
      });

      describe('return value', function() {
        context('when valid', function() {
          it('#travis returns true', function() {
            obj = {
              username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
              first_name: 'Test', last_name: 'User', acceptTerms: true
            };

            expect(form.validateForm(obj)).toBe(true);
          });
        });

        context('when invalid', function() {
          it('#travis returns false', function() {
            obj = {username: '', password: ''};
            expect(form.validateForm(obj)).toBe(false);
          });
        });
      });

      describe('criteria', function() {     
        context('prohibited', function() {
          afterEach(function() {
            expect(form.validateForm(formData)).toBe(false);
          });

          describe('username', function() {
            it('#travis must exist', function() {
              formData.username = null;
            });

            it('#travis must be at least 6 characters', function() {
              formData.username = 'testu';
            });
          });

          describe('password', function() {
            it('#travis must be present', function() {
              formData.password = null;
            });

            it('#travis must be at least 8 characters', function() {
              formData.password = 'te5tu5r'
            });

            it('#travis must contain letters', function() {
              formData.password = '82795777';
            });

            it('#travis must contain numbers', function() {
              formData.password = 'testuser';
            });

            it('#travis cannot match the username', function() {
              formData.password = formData.username
            });
          });

          describe('email', function() {
            it('#travis has to contain @', function() {
              formData.email = '';
            });

            it('#travis has to contain something before the @', function() {
              formData.email = '@foo.io';
            });

            it('#travis has to contain a domain after the @', function() {
              formData.email = 'foo@bar';
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('#travis must be longer than 1 character', function() {
                formData[field] = 'C';
              });

              it('#travis can\'t contain numbers', function() {
                formData[field] = 'Ca77'
              });

              it('#travis can\'t contain special characters', function() {
                formData[field] = 'Mary!'
              });
            });
          });
        });

        context('allowed', function() {
          afterEach(function() {
            expect(form.validateForm(formData)).toBe(true);
          });
          
          describe('username', function() {
            it('#travis can contain special characters', function() {
              formData.username = '8!!#%5ajouuk';
            });

            it('#travis can contain only letters', function() {
              formData.username = 'testus';
            });

            it('#travis can contain only numbers', function() {
              formData.username = '81135800';
            });

            it('#travis can contain spaces', function() {
              formData.username = 'Mary Sue';
            });
          });

          describe('password', function() {
            it('#travis can contain special characters', function() {
              formData.password = '8!!#%5aj';
            });

            it('#travis can contain only alphanumeric characters', function() {
              formData.password = '8113XAB00';
            });

            it('#travis can contain spaces', function() {
              formData.password = 'Mary Sue 62';
            });          
          });

          describe('email', function() {
            it('#travis can contain periods', function() {
              formData.email = 'dana.scheider@gmail.com';
            });

            it('#travis can contain subdomains', function() {
              formData.email = 'dana@admin.canto.si';
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('#travis can include spaces', function() {
                formData[field] = 'Mary Sue'
              });

              it('#travis can include hyphens', function() {
                formData[field] = 'Mary-Sue'
              });

              it('#travis can include apostrophes', function() {
                formData[field] = "O'Brien";
              });
            });
          });
        });
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('#travis calls render on the Canto View prototype', function() {
        spyOn(Canto.View.prototype.render, 'call');
        form.render();
        expect(Canto.View.prototype.render.call).toHaveBeenCalled();
        expect(Canto.View.prototype.render.call.calls.argsFor(0)).toContain(form);
      });
    });
  });
});