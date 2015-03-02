define([
  'backbone', 
  'views/main/homepage', 
  'views/partials/loginForm',
  'models/user',
  'utils', 
  'cookie'
  ], function(Backbone, HomepageView, LoginForm, User, Utils) {

  describe('HomepageView', function() {
    var view, tmpView, server, spy, e;
    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new HomepageView(); }
    });

    afterEach(function() { 
      view.remove();
      sandbox.restore(); 
    });

    describe('constructor', function() {
      it('instantiates a login form', function() {
        var newView = new HomepageView();
        newView.$loginForm.should.exist;
      });

      it('doesn\'t call render', function() {
        sandbox.stub(HomepageView.prototype, 'render');
        var newView = new HomepageView();
        HomepageView.prototype.render.called.should.be.false;
      });
    });

    describe('homepage elements', function() {
      beforeEach(function() {
        view.render();
      });

      describe('top nav', function() {
        it('is present', function() {
          view.$('#navbar-top').should.exist;
        });

        it('has a link to log in', function() {
          view.$('#navbar-top').find('.login-link').should.exist;
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
      // When the login form is submitted, it emits a `redirect` event, which
      // should then trigger a `redirect` event on the homepage itself. 
      // The presenter listens for the redirect event.

      describe('login form', function() {
        it('is hidden initially', function() {
          view.$loginForm.$el.should.not.be.visible;
        });

        it('triggers the redirect event', function() {
          var newView = new HomepageView();
          spy = sandbox.spy();
          newView.on('redirect', spy);
          newView.$loginForm.trigger('redirect', {destination: 'dashboard'});
          spy.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
          newView.off()
        });
      });

      it('has a \'features\' section', function() {
        view.$('section#features').should.exist;
      });

      it('has contact information', function() {
        view.$('#contact-us').should.exist;
      });
    });

    describe('events', function() {
      beforeEach(function() {
        sandbox.stub(HomepageView.prototype, 'hideLoginForm');
        sandbox.stub(HomepageView.prototype, 'createUser');
        sandbox.stub(HomepageView.prototype, 'toggleLoginForm');
        tmpView = new HomepageView();
        tmpView.render();
      });

      afterEach(function() {
        tmpView.remove();
      });

      it('triggers the createUser callback', function() {
        var e = $.Event('submit', {target: tmpView.$('#registration-form')});
        e.preventDefault();
        tmpView.$('#registration-form').trigger(e);
      });

      it('triggers the toggleLoginForm callback', function() {
        e = $.Event('click');
        tmpView.$('nav li .login-link').trigger(e);
        tmpView.toggleLoginForm.calledOnce.should.be.true;
      });

      it('triggers the hideLoginForm callback', function() {
        tmpView.$('#shade').children().show();
        e = $.Event('dblclick');
        tmpView.$('#shade').trigger(e);
        tmpView.hideLoginForm.calledOnce.should.be.true;
      });

      it('emits redirect event', function() {
        spy = sandbox.spy();
        tmpView.on('redirect', spy);
        tmpView.$loginForm.trigger('redirect', {destination: 'dashboard'});
        spy.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
        tmpView.off();
      });
    });

    describe('createUser() method', function() {
      beforeEach(function() {
        view.render();

        // Create a fake server to handle the Ajax request

        server = sandbox.useFakeServer();

        // Stub the Utils.getAttributes() method, which will provide
        // the form data used to create the user

        getAttributes = sandbox.stub(Utils, 'getAttributes');
        getAttributes.returns({
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User'
        });

        e = $.Event('submit', {target: view.$('#registration-form')});
      });

      it('doesn\'t refresh the page', function() {
        sandbox.spy(e, 'preventDefault');
        view.createUser(e);
        e.preventDefault.calledOnce.should.be.true;
      });

      it('instantiates a user model', function() {
        sandbox.stub(User.prototype, 'initialize');
        view.createUser(e);
        User.prototype.initialize.calledOnce.should.be.true;
      });

      describe('successful user creation', function() {
        beforeEach(function() {

          // Stub jQuery cookie
          sandbox.stub($, 'cookie');

          // Set up spy to listen for the view's 'redirect' event
          spy = sandbox.spy();
          view.on('redirect', spy);

          // Mock server response providing user ID to be set in cookie
          var obj = JSON.stringify({"id":343, "username":"testuser245", "first_name":"Test", "last_name":"User", "email":"tu245@example.org"});
          server.respondWith(/\/users$/, function(xhr) {
            xhr.respond(201, {'Content-Type': 'application/json'}, obj);
          });

          // Submit the form and trigger the server response
          view.createUser(e);
          server.respond();
        });

        afterEach(function() {
          // Unbind the spy from the view's 'redirect' event
          view.off('redirect');
        });

        it('sets the auth cookie as a session cookie', function() {
          $.cookie.calledWithExactly('auth', btoa('testuser245:245usertest')).should.be.true;
        });

        it('sets the userID cookie as a session cookie', function() {
          $.cookie.calledWithExactly('userID', 343).should.be.true;
        });

        it('triggers redirect', function() {
          spy.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
        });
      });

      describe('unsuccessful user creation', function() {
        beforeEach(function() {
          sandbox.stub($, 'cookie');
          sandbox.stub(console, 'log');

          server.respondWith(/\/users$/, function(xhr) {
            xhr.respond(422);
          });

          view.$('#registration-form').submit(function() { return false; });
          server.respond();
        });

        it('does not create cookies', function() {
          $.cookie.called.should.be.false;
        });
      });

      describe('unauthorized user creation', function() {
        beforeEach(function() {
          sandbox.stub($, 'cookie');
          sandbox.stub(console, 'log');

          server.respondWith(/\/users$/, function(xhr) {
            xhr.respond(401);
          });

          view.$('#registration-form').submit(function() { return false; });
          server.respond();
        });

        it('does not create cookies', function() {
          $.cookie.called.should.be.false;
        });
      });
    });

    describe('hideLoginForm() method', function() {
      beforeEach(function() {
        view.render();

        // show the login form
        view.$('div.text-vertical-center').children().show();
        view.$('#shade').show();
        view.$loginForm.$el.show();

        // The 'dblclick' event on the '#shade' element triggers the
        // `hideLoginForm()` callback
        
        e = $.Event('dblclick', {target: view.$('#shade')});        
        view.hideLoginForm(e);
      });

      it('hides the login form', function() {
        view.$loginForm.$el.should.not.be.visible;
      });

      it('hides the #shade element', function() {
        view.$('#shade').should.not.be.visible;
      });

      it('shows the page text', function() {
        view.$('div.text-vertical-center').should.be.visible;
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
            view.$('#shade').children().should.be.visible;       
          });

          it('displays the login form', function() {
            view.$loginForm.$el.should.be.visible;
          });

          // FIX: The page is currently set up to handle the login-form only on
          //      on the top part, where the center text goes away. It should be
          //      tested on other sections of the page as well.
          it('also works on parts of the page other than the top');
        });

        describe('when there is a logged-in user', function() {
          it('triggers redirect on the view', function() {
            sandbox.stub($, 'cookie').returns('foobar');
            var spy = sandbox.spy();
            view.on('redirect', spy)
            view.toggleLoginForm();
            spy.calledOnce.should.be.true;
          });
        });
      });

      describe('hiding the login form', function() {
        beforeEach(function() {
          view.render();
          view.toggleLoginForm(); // show the login form
          view.toggleLoginForm(); // hide it again
        });

        it('hides the login form', function() {
          view.$loginForm.$el.should.not.be.visible;
        });

        it('hides the #shade element', function() {
          view.$('#shade').should.not.be.visible;
        });

        it('shows the center text', function() {
          view.$('div.text-vertical-center').children().should.be.visible;      
        });
      });
    });
  });
});