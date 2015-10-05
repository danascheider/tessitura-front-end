/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    ccontext       = ddescribe;

/* Registration Form View Spec
/****************************************************************************/

describe('Registration Form View', function() {
  var form, newForm, e, spy, obj;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    form = new Tessitura.RegistrationFormView();
  });

  afterEach(function() {
    form.destroy();
    newForm && newForm.destroy();
  });
  
  /* View Elements
  /**************************************************************************/
  describe('constructor', function() {
    it('instantiates an error panel view #registrationFormView #partialView #view #travis', function() {
      expect(typeof form.errorPanelView).not.toBe('undefined');
    });
  });

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

      it('has a captcha #registrationFormView #partialView #view #travis');

      it('has a submit button #registrationFormView #partialView #view #travis', function() {
        expect(form.$('button[type=submit]')).toHaveLength(1);
      });

      describe('TOU checkbox', function() {
        it('exists #registrationFormView #partialView #view #travis', function() {
          expect(form.$('input[name="acceptTerms"]')).toExist();
        });

        it('is not checked by default #registrationFormView #partialView #view #travis', function() {
          expect(form.$('input[name=acceptTerms]').prop('checked')).toBe(false);
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
    describe('createUser()', function() {
      beforeEach(function() {
        obj = {
          username: 'testuser245', password: '245usertest', passwordConfirmation: '245usertest', 
          email: 'tu245@example.org', emailConfirmation: 'tu245@example.org',
          first_name: 'Test', last_name: 'User', acceptTerms: true
        };

        spy = jasmine.createSpy();
        form.on('userCreated', spy);

        spyOn(Tessitura.Utils, 'getAttributes').andReturn(obj);      

        e = $.Event('submit', {target: form.$el});
      });

      afterEach(function() { form.off('userCreated'); });

      it('doesn\'t refresh the page #registrationFormView #partialView #view #travis', function() {
        spyOn(e, 'preventDefault').andCallThrough();
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
        expect(Tessitura.UserModel.prototype.save.calls[0].args).toContain(obj2);
      });

      context('invalid form', function() {
        beforeEach(function() {
          spyOn(form, 'validateForm').andReturn(false);
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

          spyOn($, 'ajax').andCallFake(function(args) {
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
          spyOn($, 'ajax').andCallFake(function(args) {
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

    describe('removeError()', function() {
      beforeEach(function() {
        form.$('fieldset.terms').addClass('has-error');
      });

      it('removes the .has-error class #registrationFormView #partialView #view #travis', function() {
        form.removeError();
        expect(form.$('fieldset.terms').attr('class')).not.toMatch('has-error');
      });
    });

    describe('toggleCheckbox()', function() {
      beforeEach(function() {
        form.render();
      });

      it('calls removeError #registrationFormView #partialView #view #travis', function() {
        spyOn(form, 'removeError');
        form.toggleCheckbox();
        expect(form.removeError).toHaveBeenCalled();
      });

      it('checks an unchecked checkbox #registrationFormView #partialView #view #travis', function() {
        form.$('input[name=acceptTerms]').prop('checked', false);
        form.toggleCheckbox();
        expect(form.$('input[name=acceptTerms]').prop('checked')).toBeTruthy;
      });

      xit('unchecks a checked checkbox #registrationFormView #partialView #view #travis', function() {
        // FUFNR
        form.$('input[name=acceptTerms]').prop('checked', true);
        form.toggleCheckbox();
        expect(form.$('input[name=acceptTerms]').prop('checked')).toBe(false);
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('validateForm()', function() {
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

    describe('validEmail()', function() {
      context('valid e-mail', function() {
        it('returns true #registrationFormView #partialView #view #travis', function() {
          expect(form.validEmail('foo@example.com', 'foo@example.com')).toBe(true);
        });
      });

      context('missing e-mail', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validEmail(undefined, 'foo@example.com')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validEmail();
          expect(form.errors).toContain('E-mail is required');
        });
      });

      context('missing confirmation', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validEmail('foo@example.com')).toBe(false)
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validEmail('foo@example.com');
          expect(form.errors).toContain('E-mail confirmation is required');
        });
      });

      context('bad e-mail format', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validEmail('foobar', 'foobar')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validEmail('foobar', 'foobar');
          expect(form.errors).toContain('Not a valid e-mail address');
        });
      });

      context('e-mail doesn\'t match confirmation', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validEmail('foo@example.com', 'bar@example.com')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validEmail('foo@example.com', 'bar@example.com');
          expect(form.errors).toContain('E-mail and e-mail confirmation don\'t match');
        });
      });
    });

    describe('validName()', function() {
      context('valid first and last names', function() {
        it('returns true #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('Ethan', 'Allen')).toBe(true);
        });
      });

      context('first name missing', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName(undefined, 'Allen')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName(undefined, 'Allen');
          expect(form.errors).toContain('First name is required');
        });
      });

      context('last name missing', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('Ethan')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName('Ethan');
          expect(form.errors).toContain('Last name is required');
        });
      });

      context('first name too short', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('E', 'Allen')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName('E', 'Allen');
          expect(form.errors).toContain('First name must be at least 2 characters long');
        });
      });


      context('last name too short', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('Ethan', 'A')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName('Ethan', 'A');
          expect(form.errors).toContain('Last name must be at least 2 characters long');
        });
      });

      context('illegal characters in first name', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('Eth@n', 'Allen')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName('Eth@n', 'Allen');
          expect(form.errors).toContain('First name may only contain letters, spaces, \', and -');
        });
      });

      context('illegal characters in last name', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validName('Ethan', 'All3n')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validName('Ethan', 'All3n');
          expect(form.errors).toContain('Last name may only contain letters, spaces, \', and -');
        });
      });
    });

    describe('validUsername()', function() {
      context('when the username is valid', function() {
        it('returns true #registrationFormView #partialView #view #travis', function() {
          expect(form.validUsername('frank446')).toBe(true);
        });
      });

      context('nonexistent username', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validUsername()).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validUsername();
          expect(form.errors).toContain('Username is required');
        });
      });

      context('username too short', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validUsername('bob')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validUsername('bob');
          expect(form.errors).toContain('Username must be at least 6 characters long');
        });
      });

      context('invalid character in username', function() {
        it('returns false #registrationFormView #partialView #view #travis', function() {
          expect(form.validUsername('kelly^^^')).toBe(false);
        });

        it('adds the message to the errors object #registrationFormView #partialView #view #travis', function() {
          form.validUsername('kelly^^^');
          expect(form.errors).toContain('Username may contain only alphanumeric characters, spaces, _, and -')
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
        expect(Tessitura.View.prototype.render.call.calls[0].args).toContain(form);
      });
    });
  });
});