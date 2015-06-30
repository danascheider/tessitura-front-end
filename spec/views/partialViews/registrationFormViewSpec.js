/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

/* Registration Form View Spec
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
  
  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      form.render();
    });

    it('is a form #registrationFormView #partialView #view #travis', function() {
      expect(form.$el).toHaveTag('form');
    });

    it('has ID #registration-form #registrationFormView #partialView #view #travis', function() {
      expect(form.$el).toHaveId('registration-form');
    });

    describe('form fields', function() {
      _.each(['username', 'password', 'passwordConfirmation', 'email', 'emailConfirmation', 'first_name', 'last_name', 'birthdate', 'fach', 'city', 'country'], function(field) {
        it('has a ' + field + ' field #registrationFormView #partialView #view #travis', function() {
          expect(form.$('input[name=' + field + ']')).toHaveLength(1);
        });
      });

      it('has a captcha #registrationFormView #partialView #view #travis', function() {
        pending('Figure out how to fit the captcha into the design');
      });

      it('has a submit button #registrationFormView #partialView #view #travis', function() {
        expect(form.$('button[type=submit]')).toHaveLength(1);
      });

      describe('TOU checkbox', function() {
        it('exists #registrationFormView #partialView #view #travis', function() {
          expect(form.$('input[name="acceptTerms"]')).toExist();
        });

        it('is not checked by default #registrationFormView #partialView #view #travis', function() {
          expect(form.$('input[name="acceptTerms"]')).not.toBeChecked();
        });
      });
    });
  });

  /* View Events
  /**************************************************************************/

  describe('view events', function() {
    describe('submit', function() {
      it('calls createUser #registrationFormView #partialView #view #travis', function() {
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

      it('doesn\'t refresh the page #registrationFormView #partialView #view #travis', function() {
        spyOn(e, 'preventDefault').and.callThrough();
        form.createUser(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('instantiates a user model #registrationFormView #partialView #view #travis', function() {
        spyOn(Tessitura.UserModel.prototype, 'initialize');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.initialize).toHaveBeenCalled();
      });

      it('calls validateForm #registrationFormView #partialView #view #travis', function() {
        spyOn(form, 'validateForm');
        form.createUser(e);
        expect(form.validateForm).toHaveBeenCalled();
      });

      it('calls save on the user #registrationFormView #partialView #view #travis', function() {
        spyOn(Tessitura.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.save).toHaveBeenCalled();
      });

      it('uses the attributes from the form #registrationFormView #partialView #view #travis', function() {
        var obj2 = {
          username: 'testuser245', password: '245usertest', 
          email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User'
        }

        delete obj2.passwordConfirmation;
        delete obj2.emailConfirmation;

        spyOn(Tessitura.UserModel.prototype, 'save');
        form.createUser(e);
        expect(Tessitura.UserModel.prototype.save.calls.argsFor(0)).toContain(obj2);
      });

      context('invalid form', function() {
        beforeEach(function() {
          spyOn(form, 'validateForm').and.returnValue(false);
          spyOn($, 'cookie');
        });

        it('doesn\'t create a user #registrationFormView #partialView #view #travis', function() {
          spyOn(Tessitura.UserModel.prototype, 'initialize');
          form.createUser(e);
          expect(Tessitura.UserModel.prototype.initialize).not.toHaveBeenCalled();
        });

        it('doesn\'t trigger userCreated #registrationFormView #partialView #view #travis', function(done) {
          spy = jasmine.createSpy();
          form.on('userCreated', spy);
          form.createUser(e);
          expect(spy).not.toHaveBeenCalled();
          done();
          form.off('userCreated');
        });

        it('doesn\'t set cookies #registrationFormView #partialView #view #travis', function() {
          form.createUser(e);
          expect($.cookie).not.toHaveBeenCalled();
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

        it('sets the auth cookie as a session cookie #registrationFormView #partialView #view #travis', function(done) {
          expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser245:245usertest'));
          done();
        });

        it('sets the userID cookie as a session cookie #registrationFormView #partialView #view #travis', function(done) {
          expect($.cookie).toHaveBeenCalledWith('userID', 245);
          done();
        });

        it('emits the userCreated event #registrationFormView #partialView #view #travis', function(done) {
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

        it('doesn\'t set cookies #registrationFormView #partialView #view #travis', function(done) {
          expect($.cookie).not.toHaveBeenCalled();
          done();
        });

        it('doesn\'t trigger \'userCreated\' #registrationFormView #partialView #view #travis', function(done) {
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
      it('returns true with argument \'RegistrationFormView\' #registrationFormView #partialView #view #travis', function() {
        expect(form.isA('RegistrationFormView')).toBe(true);
      });

      it('returns true with argument \'RegistrationForm\' #registrationFormView #partialView #view #travis', function() {
        expect(form.isA('RegistrationForm')).toBe(true);
      });

      it('returns true with argument \'FormView\' #registrationFormView #partialView #view #travis', function() {
        expect(form.isA('FormView')).toBe(true);
      });

      it('returns true with argument \'PartialView\' #registrationFormView #partialView #view #travis', function() {
        expect(form.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #registrationFormView #partialView #view #travis', function() {
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
          it('returns true #registrationFormView #partialView #view #travis', function() {
            expect(form.validateForm(formData)).toBe(true);
          });
        });

        context('when invalid', function() {
          it('returns false #registrationFormView #partialView #view #travis', function() {
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
            it('must exist #registrationFormView #partialView #view #travis', function() {
              formData.username = null;
            });

            it('must be at least 6 characters #registrationFormView #partialView #view #travis', function() {
              formData.username = 'testu';
            });

            it('can\'t contain special characters #registrationFormView #partialView #view #travis', function() {
              formData.username = '8!!#%5ajouuk';
            });
          });

          describe('password', function() {
            it('must be present #registrationFormView #partialView #view #travis', function() {
              formData.password = null;
            });

            it('must be at least 8 characters #registrationFormView #partialView #view #travis', function() {
              formData.password = 'te5tu5r'
            });

            it('must contain letters #registrationFormView #partialView #view #travis', function() {
              formData.password = '82795777';
            });

            it('must contain numbers #registrationFormView #partialView #view #travis', function() {
              formData.password = 'testuser';
            });

            it('cannot match the username #registrationFormView #partialView #view #travis', function() {
              formData.password = formData.username
            });

            it('requires a confirmation #registrationFormView #partialView #view #travis', function() {
              delete formData.passwordConfirmation;
            });

            it('must match the confirmation #registrationFormView #partialView #view #travis', function() {
              formData.passwordConfirmation = 'foobarbaz101';
            });
          });

          describe('email', function() {
            it('has to contain @ #registrationFormView #partialView #view #travis', function() {
              formData.email = '';
              formData.emailConfirmation = '';
            });

            it('has to contain something before the @ #registrationFormView #partialView #view #travis', function() {
              formData.email = '@foo.io';
              formData.emailConfirmation = '@foo.io';
            });

            it('has to contain a domain after the @ #registrationFormView #partialView #view #travis', function() {
              formData.email = 'foo@bar';
              formData.emailConfirmation = 'foo@bar';
            });

            it('has to include a confirmation #registrationFormView #partialView #view #travis', function() {
              delete formData.emailConfirmation;
            });

            it('has to match the confirmation #registrationFormView #partialView #view #travis', function() {
              formData.emailConfirmation = 'dana.scheider@tessitura.io';
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('must be longer than 1 character #registrationFormView #partialView #view #travis', function() {
                formData[field] = 'C';
              });

              it('can\'t contain numbers #registrationFormView #partialView #view #travis', function() {
                formData[field] = 'Ca77'
              });

              it('can\'t contain special characters #registrationFormView #partialView #view #travis', function() {
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
            it('can contain only letters #registrationFormView #partialView #view #travis', function() {
              formData.username = 'testus';
            });

            it('can contain only numbers #registrationFormView #partialView #view #travis', function() {
              formData.username = '81135800';
            });

            it('can contain spaces #registrationFormView #partialView #view #travis', function() {
              formData.username = 'Mary Sue';
            });
          });

          describe('password', function() {
            it('can contain special characters #registrationFormView #partialView #view #travis', function() {
              formData.password = '8!!#%5aj';
              formData.passwordConfirmation = '8!!#%5aj'
            });

            it('can contain only alphanumeric characters #registrationFormView #partialView #view #travis', function() {
              formData.password = '8113XAB00';
              formData.passwordConfirmation = '8113XAB00';
            });

            it('can contain spaces #registrationFormView #partialView #view #travis', function() {
              formData.password = 'Mary Sue 62';
              formData.passwordConfirmation = 'Mary Sue 62';
            });
          });

          describe('email', function() {
            it('can contain periods #registrationFormView #partialView #view #travis', function() {
              formData.email = 'dana.scheider@gmail.com';
              formData.emailConfirmation = 'dana.scheider@gmail.com';
            });

            it('can contain subdomains #registrationFormView #partialView #view #travis', function() {
              formData.email = 'dana@admin.tessitura.io';
              formData.emailConfirmation = 'dana@admin.tessitura.io'
            });
          });

          _.each(['first_name', 'last_name'], function(field) {
            describe(field, function() {
              it('can include spaces #registrationFormView #partialView #view #travis', function() {
                formData[field] = 'Mary Sue'
              });

              it('can include hyphens #registrationFormView #partialView #view #travis', function() {
                formData[field] = 'Mary-Sue'
              });

              it('can include apostrophes #registrationFormView #partialView #view #travis', function() {
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
      it('calls render on the Tessitura View prototype #registrationFormView #partialView #view #travis', function() {
        spyOn(Tessitura.View.prototype.render, 'call');
        form.render();
        expect(Tessitura.View.prototype.render.call).toHaveBeenCalled();
        expect(Tessitura.View.prototype.render.call.calls.argsFor(0)).toContain(form);
      });
    });
  });
});