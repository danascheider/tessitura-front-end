define(['backbone', 'views/app/login-form', 'cookie'], function(Backbone, LoginForm) {
  
  describe('LoginForm', function() {

    // Instantiate variable to be defined in `beforeEach` block

    var loginForm;

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

      // it('has a \'remember me\' checkbox', function() {
      //   // 
      // });
      
      // it('has a link for login help', function() {
      //   //
      // });
    });
  });
});