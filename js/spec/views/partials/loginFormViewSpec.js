define(['backbone', 'views/app/login-form', 'utils', 'cookie'], function(Backbone, LoginForm, Utils) {
  
  describe('LoginForm View', function() {

    // Instantiate variable to be defined in `beforeEach` block

    var loginForm, server, getAttributes, spy;

    beforeEach(function() {
      if(typeof loginForm === 'undefined') { loginForm = new LoginForm(); }
    });

    describe('elements', function() {
      beforeEach(function() {
        loginForm.reset().render();
      });

      it('is a form', function() { loginForm.$el[0].tagName.should.equal('FORM'); });

      it('has ID #login-form', function() { loginForm.$el[0].id.should.equal('login-form'); });

      it('has a username field', function() { loginForm.$('input[name="username"]').length.should.equal(1); });

      it('has a password field', function() { loginForm.$('input[name="password"]').length.should.equal(1); });

      it('has a link for login help', function() { loginForm.$('a.login-help-link').length.should.equal(1); });

      it('has a submit button', function() { loginForm.$('button[type="submit"]').length.should.equal(1) });
      
      describe('\'remember\' checkbox', function() {
        it('exists', function() {
          loginForm.$('input[name="remember"]').length.should.equal(1);
        });

        it('is a checkbox', function() {
          loginForm.$('input[name="remember"]')[0].type.should.equal('checkbox');
        });

        it('is checked by default', function() {
          loginForm.$('input[name="remember"]')[0].checked.should.equal(true);
        });
      });
    });

    describe('events', function() {
      var help;

      beforeEach(function() {
        sinon.stub(LoginForm.prototype, 'loginHelp');
        sinon.stub(LoginForm.prototype, 'loginUser');
        sinon.fakeServer.create();
        newLoginForm = new LoginForm();
        newLoginForm.render();
      });

      afterEach(function() { 
        LoginForm.prototype.loginHelp.restore();
        LoginForm.prototype.loginUser.restore();
        newLoginForm.remove(); 
      });

      describe('click on the login help link', function() {
        it('calls the loginHelp() method', function() {
          newLoginForm.$('.login-help-link').click();
          LoginForm.prototype.loginHelp.calledOnce.should.be.true;
        });
      });

      describe('submit the login form', function() {
        beforeEach(function() { 
          e = $.Event('submit', {target: newLoginForm.$el});
          sinon.spy(e, 'preventDefault');
          newLoginForm.$el.trigger(e);
        });

        afterEach(function() { e.preventDefault.restore(); });

        it('calls the loginUser() method', function() {
          LoginForm.prototype.loginUser.calledOnce.should.be.true;
        });
      });
    });

    describe('loginHelp() method', function() {
      it('does not log \'Haha, you\'re boned!\' to the console');
    });

    describe('loginUser() method with \'Remember Me\' true', function() {
      beforeEach(function() {
        loginForm.reset().render();

        e = $.Event('submit', {target: loginForm.$el});

        server = sinon.fakeServer.create();
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
      });

      afterEach(function() {
        Utils.getAttributes.restore();
      });

      it('makes a POST request', function() {
        loginForm.loginUser(e);
        server.requests[0].method.should.equal('POST');
      });

      it('sends request to /login endpoint', function() {
        loginForm.loginUser(e);
        server.requests[0].url.should.match(/\/login$/);
      });

      it('includes a basic auth header and hash', function() {
        loginForm.loginUser(e);
        var str = 'Basic ' + btoa('testuser:testuser');
        server.requests[0].requestHeaders.Authorization.should.equal(str);
      });

      describe('setting cookies', function() {
        beforeEach(function() {
          // Stub jQuery cookie
          sinon.stub($, 'cookie');

          // Spy on loginSuccess event
          spy = sinon.spy();
          loginForm.on('loginSuccess', spy);

          // Create mock response
          var obj = JSON.stringify({"user": {"id":342, "username":"testuser", "first_name":"Test", "last_name":"User", "email":"testuser@example.com"}});
          server.respondWith(/\/login$/, function(xhr) {
            xhr.respond(200, {'Content-Type': 'application/json'}, obj);
          });

          // Submit the form
          loginForm.loginUser(e);

          // Send the server response
          server.respond();
        });

        afterEach(function() {
          $.cookie.restore();
          server.restore();
          loginForm.off('loginSuccess');
        });

        it('sets auth cookie to expire in 365 days', function() {
          $.cookie.calledWithExactly('auth', btoa('testuser:testuser'), {expires: 365}).should.be.true;
        });

        it('sets userID cookie to expire in 365 days', function() {
          $.cookie.calledWithExactly('userID', 342, {expires: 365}).should.be.true;
        });

        it('triggers the `loginSuccess` event', function() {
          spy.calledOnce.should.be.true;
        });
      });
    });

    describe('loginUser() method with \'Remember Me\' false', function() {
      beforeEach(function() {
        loginForm.reset().render();

        e = $.Event('submit', {target: loginForm.$el});

        server = sinon.fakeServer.create();
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: null});
      });

      afterEach(function() {
        Utils.getAttributes.restore();
      });

      it('makes a POST request', function() {
        loginForm.loginUser(e);
        server.requests[0].method.should.equal('POST');
      });

      it('sends request to /login endpoint', function() {
        loginForm.loginUser(e);
        server.requests[0].url.should.match(/\/login$/);
      });

      it('includes a basic auth header and hash', function() {
        var str = 'Basic ' + btoa('testuser:testuser');
        loginForm.loginUser(e);
        server.requests[0].requestHeaders.Authorization.should.equal(str);
      });

      describe('setting cookies', function() {
        beforeEach(function() {
          // Stub jQuery cookie
          sinon.stub($, 'cookie');

          // Spy on loginSuccess event
          spy = sinon.spy();
          loginForm.on('loginSuccess', spy);

          // Create mock response
          var obj = JSON.stringify({"user": {"id":342, "username":"testuser", "first_name":"Test", "last_name":"User", "email":"testuser@example.com"}});
          server.respondWith(/\/login$/, function(xhr) {
            xhr.respond(200, {'Content-Type': 'application/json'}, obj);
          });

          // Submit the form
          loginForm.loginUser(e);

          // Send the server response
          server.respond();
        });

        afterEach(function() {
          $.cookie.restore();
          server.restore();
          loginForm.off('loginSuccess');
        });

        it('sets auth cookie as session cookie', function() {
          $.cookie.calledWithExactly('auth', btoa('testuser:testuser')).should.be.true;
        });

        it('sets userID cookie as session cookie', function() {
          $.cookie.calledWithExactly('userID', 342).should.be.true;
        });

        it('triggers the `loginSuccess` event', function() {
          spy.calledOnce.should.be.true;
        });
      });
    });

    describe('loginUser() method with invalid credentials', function() {
      beforeEach(function() {
        // Stub jQuery cookie
        sinon.stub($, 'cookie');

        // Create and render the LoginForm view
        loginForm.reset().render();

        // Spy on the loginSuccess event
        spy = sinon.spy();
        loginForm.on('loginSuccess', spy);

        e = $.Event('submit', {target: loginForm.$el});

        // Create a fake server to respond to the login request, which raises
        // an authorization error in this test case
        server = sinon.fakeServer.create();
        server.respondWith([401, {}, 'Authorization Required\n']);

        // Stub the getAttributes method that gets the data out of the form
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: null});
      
        // Submit the form
        loginForm.loginUser(e);

        // Trigger the server response
        server.respond();
      });

      afterEach(function() {
        loginForm.off('loginSuccess');
        Utils.getAttributes.restore();
        $.cookie.restore();
        server.restore();
      });

      it('does not set cookies', function() {
        $.cookie.called.should.be.false;
      });

      it('does not trigger a `loginSuccess` event', function() {
        spy.called.should.be.false;
      });
    });

    describe('render() function', function() {
      it('returns the form', function() {
        loginForm.render().should.equal(loginForm);
      });
    });

    describe('reset() method', function() {
      beforeEach(function() {
        loginForm.render();
      });

      it('removes the view from the DOM', function() {
        sinon.spy(loginForm, 'remove');
        loginForm.reset();
        loginForm.remove.calledOnce.should.be.true;
        loginForm.remove.restore();
      });

      it('returns the view', function() {
        loginForm.reset().should.equal(loginForm);
      });
    });
  });
});