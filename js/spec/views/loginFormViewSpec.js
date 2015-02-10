define(['backbone', 'views/app/login-form', 'utils', 'cookie'], function(Backbone, LoginForm, Utils) {
  
  describe('LoginForm', function() {

    // Instantiate variable to be defined in `beforeEach` block

    var loginForm, server, getAttributes, spy;

    describe('elements', function() {
      beforeEach(function() {
        loginForm = new LoginForm();
        loginForm.render();
      });

      afterEach(function() {
        loginForm.remove();
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

    describe('event handling', function() {
      //
    });

    describe('loginHelp() method', function() {
      it('does not log \'Haha, you\'re boned!\' to the console');
    });

    describe('loginUser() method with \'Remember Me\' true', function() {
      beforeEach(function() {
        loginForm = new LoginForm();
        loginForm.render();

        server = sinon.fakeServer.create();
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
      });

      afterEach(function() {
        loginForm.remove();
        Utils.getAttributes.restore();
      });

      it('makes a POST request', function() {
        loginForm.$el.submit();
        server.requests[0].method.should.equal('POST');
      });

      it('sends request to /login endpoint', function() {
        loginForm.$el.submit();
        server.requests[0].url.should.match(/\/login$/);
      });

      it('includes a basic auth header and hash', function() {
        loginForm.$el.submit();
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
          loginForm.$el.submit();

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
        loginForm = new LoginForm();
        loginForm.render();

        server = sinon.fakeServer.create();
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: null});
      });

      afterEach(function() {
        loginForm.remove();
        Utils.getAttributes.restore();
      });

      it('makes a POST request', function() {
        loginForm.$el.submit();
        server.requests[0].method.should.equal('POST');
      });

      it('sends request to /login endpoint', function() {
        loginForm.$el.submit();
        server.requests[0].url.should.match(/\/login$/);
      });

      it('includes a basic auth header and hash', function() {
        loginForm.$el.submit();
        var str = 'Basic ' + btoa('testuser:testuser');
        server.requests[0].requestHeaders.Authorization.should.equal(str);
      });

      describe('setting cookies', function() {
        beforeEach(function() {
          // Stub jQuery cookie
          sinon.stub($, 'cookie');

          // Spy on the loginSuccess event
          spy = sinon.spy();
          loginForm.on('loginSuccess', spy);

          // Prepare server response to login request
          var obj = JSON.stringify({"user": {"id":342, "username":"testuser", "first_name":"Test", "last_name":"User", "email":"testuser@example.com"}});
          server.respondWith(/\/login$/, function(xhr) {
            xhr.respond(200, {'Content-Type': 'application/json'}, obj);
          });

          // Submit form
          loginForm.$el.submit();

          // Trigger server response
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
        loginForm = new LoginForm();
        loginForm.render();

        // Spy on the loginSuccess event
        spy = sinon.spy();
        loginForm.on('loginSuccess', spy);

        // Create a fake server to respond to the login request, which raises
        // an authorization error in this test case
        server = sinon.fakeServer.create();
        server.respondWith([401, {}, 'Authorization Required\n']);

        // Stub the getAttributes method that gets the data out of the form
        getAttributes = sinon.stub(Utils, 'getAttributes');
        getAttributes.withArgs(loginForm.$el).returns({username: 'testuser', password: 'testuser', remember: null});
      
        // Submit the form
        loginForm.$el.submit();

        // Trigger the server response
        server.respond();
      });

      afterEach(function() {
        loginForm.off('loginSuccess');
        loginForm.remove();
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
        loginForm = new LoginForm();
        loginForm.render().should.equal(loginForm);
      });
    });
  });
});