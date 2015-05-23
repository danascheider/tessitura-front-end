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
 * Requires ......................................................... 29   *
 * Suite ............................................................ 47   *
 *   Filters ........................................................ 50   *
 *   Static Properties .............................................. 67   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *   View Elements .................................................. 84   *
 *   Events ........................................................ 126   *
 *   Event Callbacks ............................................... 139   *
 *   Special Callbacks ............................................. 275   *
 *   Core View Functions ........................................... 468   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Registration Form View', function() {
  var form, newForm, e, spy, obj;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    form = new Tessitura.RegistrationFormView();
  });

  afterEach(function() {
    form.destroy();
    newForm && newForm.destroy();
  });

  afterAll(function() {
    form = null;
  });

  /* Static Properties
  /**************************************************************************/

  describe('static properties', function() {
    it('has klass RegistrationFormView #partialView #view #travis', function() {
      expect(form.klass).toBe('RegistrationFormView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(form.family).toBe('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(form.superFamily).toBe('Backbone.View');
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      form.render();
    });

    it('is a form #partialView #view #travis', function() {
      expect(form.$el).toHaveTag('form');
    });

    it('has ID #registration-form #partialView #view #travis', function() {
      expect(form.$el).toHaveId('registration-form');
    });

    describe('form fields', function() {
      _.each(['username', 'password', 'passwordConfirmation', 'email', 'emailConfirmation', 'first_name', 'last_name', 'birthdate', 'fach', 'city', 'country'], function(field) {
        it('has a ' + field + ' field #partialView #view #travis', function() {
          expect(form.$('input[name=' + field + ']')).toHaveLength(1);
        });
      });

      it('has a captcha #partialView #view #travis', function() {
        pending('Figure out how to fit the captcha into the design');
      });

      it('has a submit button #partialView #view #travis', function() {
        expect(form.$('button[type=submit]')).toHaveLength(1);
      });

      describe('TOU checkbox', function() {
        it('exists #partialView #view #travis', function() {
          expect(form.$('input[name="acceptTerms"]')).toExist();
        });

        it('is not checked by default #partialView #view #travis', function() {
          expect(form.$('input[name="acceptTerms"]')).not.toBeChecked();
        });
      });
    });
  });

  /* View Events
  /**************************************************************************/

  describe('view events', function() {
    describe('submit', function() {
      it('calls createUser #partialView #view #travis', function() {
        spyOn(Tessitura.RegistrationFormView.prototype, 'createUser');
        newForm = new Tessitura.RegistrationFormView();
        newForm.$el.submit();
        expect(Tessitura.RegistrationFormView.prototype.createUser).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('createUser', function() {
      beforeEach(function() {
        obj = {
          username: 'testuser245', password: '245usertest', passwordConfirmation: '245usertest', 
          email: 'tu245@example.org', emailConfirmation: 'tu245@example.org',
          first_name: 'Test', last_name: 'User', acceptTerms: true
        };

        spy = jasmine.createSpy();
        form.on('userCreated', spy);

        spyOn(Tessitura.Utils, 'getAttributes').and.returnValue(obj);      

        e = $.Event('submit', {target: form.$el});
      });

      afterEach(function() { form.off('userCreated'); });

      it('doesn\'t refresh the page #partialView #view #travis', function() {
        spyOn(e, 'preventDefault').and.callThrough();
        form.createUser(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('instantiates a user model #partialView #view #travis', function() {
        spyOn(Tessitura.UserModel.prototype, 'initialize');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.initialize).toHaveBeenCalled();
      });

      it('calls validateForm #partialView #view #travis', function() {
        spyOn(form, 'validateForm');
        form.createUser(e);
        expect(form.validateForm).toHaveBeenCalled();
      });

      it('calls save on the user #partialView #view #travis', function() {
        spyOn(Tessitura.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.save).toHaveBeenCalled();
      });

      it('uses the attributes from the form #partialView #view #travis', function() {
        spyOn(Tessitura.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.save.calls.argsFor(0)).toContain(obj)
      });

      context('invalid form', function() {
        beforeEach(function() {
          spyOn(form, 'validateForm').and.returnValue(false);
        });

        it('doesn\'t create a user #partialView #view #travis', function() {
          spyOn(Tessitura.UserModel.prototype, 'initialize');
          form.createUser(e);
          expect(Tessitura.UserModel.prototype.initialize).not.toHaveBeenCalled();
        });

        it('doesn\'t trigger userCreated #partialView #view #travis', function(done) {
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
          expect(spy).not.toHaveBeenCalled();
          done();
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

        it('sets the auth cookie as a session cookie #partialView #view #travis', function(done) {
          expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser245:245usertest'));
          done();
        });

        it('sets the userID cookie as a session cookie #partialView #view #travis', function(done) {
          expect($.cookie).toHaveBeenCalledWith('userID', 245);
          done();
        });

        it('emits the userCreated event #partialView #view #travis', function(done) {
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

        it('doesn\'t set cookies #partialView #view #travis', function(done) {
          expect($.cookie).not.toHaveBeenCalled();
          done();
        });

        it('doesn\'t trigger \'userCreated\' #partialView #view #travis', function(done) {
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
      it('returns true with argument \'RegistrationFormView\' #partialView #view #travis', function() {
        expect(form.isA('RegistrationFormView')).toBe(true);
      });

      it('returns true with argument \'RegistrationForm\' #partialView #view #travis', function() {
        expect(form.isA('RegistrationForm')).toBe(true);
      });

      it('returns true with argument \'FormView\' #partialView #view #travis', function() {
        expect(form.isA('FormView')).toBe(true);
      });

      it('returns true with argument \'PartialView\' #partialView #view #travis', function() {
        expect(form.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(form.isA('very model of a modern major general')).toBe(false);
      });
    });

    describe('validateForm', function() {
      var formData;

      beforeEach(function() {
        formData = {
          username: 'testuser245', password: '245usertest', passwordConfirmation: '245usertest',
          email: 'tu245@example.org', emailConfirmation: 'tu245@example.org',
          first_name: 'Test', last_name: 'User', acceptTerms: true
        }
      });

      describe('return value', function() {
        context('when valid', function() {
          it('returns true #partialView #view #travis', function() {
            expect(form.validateForm(formData)).toBe(true);
          });
        });

        context('when invalid', function() {
          it('returns false #partialView #view #travis', function() {
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
            it('must exist #partialView #view #travis', function() {
              formData.username = null;
            });

            it('must be at least 6 characters #partialView #view #travis', function() {
              formData.username = 'testu';
            });

            it('can\'t contain special characters #partialView #view #travis', function() {
              formData.username = '8!!#%5ajouuk';
            });
          });

          describe('password', function() {
            it('must be present #partialView #view #travis', function() {
              formData.password = null;
            });

            it('must be at least 8 characters #partialView #view #travis', function() {
              formData.password = 'te5tu5r'
            });

            it('must contain letters #partialView #view #travis', function() {
              formData.password = '82795777';
            });

            it('must contain numbers #partialView #view #travis', function() {
              formData.password = 'testuser';
            });

            it('cannot match the username #partialView #view #travis', function() {
              formData.password = formData.username
            });
          });

          describe('passwordConfirmation', function() {
            it('must be present #partialView #view #travis', function() {
              formData.passwordConfirmation  = null;
            });
          });

          describe('email', function() {
            it('has to contain @ #partialView #view #travis', function() {
              formData.email = '';
            });

            it('has to contain something before the @ #partialView #view #travis', function() {
              formData.email = '@foo.io';
            });

            it('has to contain a domain after the @ #partialView #view #travis', function() {
              formData.email = 'foo@bar';
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('must be longer than 1 character #partialView #view #travis', function() {
                formData[field] = 'C';
              });

              it('can\'t contain numbers #partialView #view #travis', function() {
                formData[field] = 'Ca77'
              });

              it('can\'t contain special characters #partialView #view #travis', function() {
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
            it('can contain only letters #partialView #view #travis', function() {
              formData.username = 'testus';
            });

            it('can contain only numbers #partialView #view #travis', function() {
              formData.username = '81135800';
            });

            it('can contain spaces #partialView #view #travis', function() {
              formData.username = 'Mary Sue';
            });
          });

          describe('password', function() {
            it('can contain special characters #partialView #view #travis', function() {
              formData.password = '8!!#%5aj';
              formData.passwordConfirmation = '8!!#%5aj'
            });

            it('can contain only alphanumeric characters #partialView #view #travis', function() {
              formData.password = '8113XAB00';
              formData.passwordConfirmation = '8113XAB00';
            });

            it('can contain spaces #partialView #view #travis', function() {
              formData.password = 'Mary Sue 62';
              formData.passwordConfirmation = 'Mary Sue 62';
            });

            it('requires a confirmation #partialView #view #travis', function() {
              delete formData.passwordConfirmation;
            });
          });

          describe('email', function() {
            it('can contain periods #partialView #view #travis', function() {
              formData.email = 'dana.scheider@gmail.com';
            });

            it('can contain subdomains #partialView #view #travis', function() {
              formData.email = 'dana@admin.Tessitura.si';
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('can include spaces #partialView #view #travis', function() {
                formData[field] = 'Mary Sue'
              });

              it('can include hyphens #partialView #view #travis', function() {
                formData[field] = 'Mary-Sue'
              });

              it('can include apostrophes #partialView #view #travis', function() {
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
      it('calls render on the Tessitura View prototype #partialView #view #travis', function() {
        spyOn(Tessitura.View.prototype.render, 'call');
        form.render();
        expect(Tessitura.View.prototype.render.call).toHaveBeenCalled();
        expect(Tessitura.View.prototype.render.call.calls.argsFor(0)).toContain(form);
      });
    });
  });
});