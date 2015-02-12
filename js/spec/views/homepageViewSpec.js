define(['backbone', 'views/app/homepage', 'utils', 'cookie'], function(Backbone, HomepageView, Utils) {
  
  describe('HomepageView', function() {
    var view, server, spy;

    beforeEach(function() {
      view = new HomepageView();
    });

    afterEach(function() {
      view.remove();
    });

    describe('constructor', function() {
      it('instantiates a login form', function() {
        view.$loginForm.should.exist;
      });
    });

    describe('homepage elements', function() {
      beforeEach(function() {
        view.render();
      });

      describe('top nav', function() {
        it('is present', function() {
          view.$('#navbar-top').should.exist();
        });

        it('has a link to log in', function() {
          view.$('#navbar-top').find('.login-link').should.exist();
        });
      });

      describe('registration form', function() {
        it('is visible', function() {
          view.$('form#registration-form').should.be.visible;
        });
      });

      // The view homepage view has a child login form view, `view.$loginForm`.
      // The homepage view controls the appearance of the login form, which is 
      // attached to its #shade div and remains invisible until a link is clicked.
      // When the login form is submitted, it emits a `loginSuccess` event, which
      // should then trigger a `loginSuccess` event on the homepage itself. 
      // The router listens for the loginSuccess event.

      describe('login form', function() {
        it('is hidden initially', function() {
          view.$('#login-form').should.not.be.visible;
        });

        it('is displayed when the link is clicked', function() {
          view.$('#navbar-top').find('.login-link').trigger('click');
          view.$('#login-form').should.be.visible;
        });

        it('triggers the loginSuccess event', function() {
          var spy = sinon.spy();
          view.on('loginSuccess', spy);
          view.$loginForm.trigger('loginSuccess');
          spy.calledOnce.should.be.true;
          view.off('loginSuccess');
        });
      });

      it('has a \'features\' section', function() {
        view.$('section#features').should.exist();
      });

      it('has contact information', function() {
        view.$('#contact-us').should.exist();
      });
    });

    describe('createUser() method', function() {
      beforeEach(function() {
        view.render();
        sinon.stub(Backbone.history, 'navigate');
        server = sinon.fakeServer.create();
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.returns({
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User'
        });
      });

      afterEach(function() {
        Utils.getAttributes.restore();
        view.remove();
        Backbone.history.navigate.restore();
      });

      it('instantiates a user model', function() {
        //
      });

      describe('successful user creation', function() {
        beforeEach(function() {
          sinon.stub($, 'cookie');
          spy = sinon.spy();
          view.on('loginSuccess', spy);

          var obj = JSON.stringify({"id":343, "username":"testuser245", "first_name":"Test", "last_name":"User", "email":"tu245@example.org"});
          server.respondWith(/\/users$/, function(xhr) {
            xhr.respond(201, {'Content-Type': 'application/json'}, obj);
          });
        });

        afterEach(function() {
          $.cookie.restore();
          view.off('loginSuccess');
        });

        it('sets the auth cookie as a session cookie', function() {
          var form = view.$('#registration-form');
          view.$('#registration-form').submit();
          server.respond();
          $.cookie.calledWithExactly('auth', btoa('testuser245:245usertest')).should.be.true;
        });
      });
    });

    describe('hideLoginForm() method', function() {
      beforeEach(function() {
        view.on('foo', view.hideLoginForm);
        view.render();

        // show the login form
        view.$('div.text-vertical-center').children().show();
        view.$('#shade').show();
        view.$loginForm.$el.show();

        // The 'dblclick' event on the '#shade' element triggers the
        // `hideLoginForm()` callback

        view.$('#shade').trigger('dblclick');
      });

      it('hides the login form', function() {
        view.$loginForm.$el.should.not.be.visible;
      });

      it('hides the #shade element', function() {
        view.$('#shade').should.not.be.visible;
      });

      it('shows the page text', function() {
        view.$('div.text-vertical-center').children().should.be.visible;
      });
    });

    describe('render() function', function() {
      beforeEach(function() {
        view.render();
      });

      it('creates a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      it('assigns the ID #homepage-wrapper', function() {
        view.$el[0].id.should.equal('homepage-wrapper');
      });
    });

    describe('toggleLoginForm() method', function() {
      describe('showing the login form', function() {
        describe('when there is no logged-in user', function() {
          beforeEach(function() {
            view.render();
            view.toggleLoginForm();
          });

          it('hides the center text', function() {
            view.$('div.text-vertical-center').should.not.be.visible;
          });

          it('displays the #shade element', function() {
            view.$('#shade').should.be.visible;
          });

          it('displays the login form', function() {
            view.$loginForm.$el.should.be.visible;
          });

          // The page is currently set up to handle the login-form only on
          // on the top part, where the center text goes away. It should be
          // tested on other sections of the page as well.
          it('also works on parts of the page other than the top');
        });

        describe('when there is a logged-in user', function() {
          //
        });
      });

      describe('hiding the login form', function() {
        beforeEach(function() {
          view.render();
          view.toggleLoginForm(); // show the login form
        });

        it('hides the login form', function() {
          view.toggleLoginForm();
          view.$loginForm.$el.should.not.be.visible;
        });

        it('hides the #shade element', function() {
          view.toggleLoginForm();
          view.$('#shade').should.not.be.visible;
        });

        it('shows the center text', function() {
          view.toggleLoginForm();
          view.$('div.text-vertical-center').should.be.visible;
        });
      });
    });
  });
});