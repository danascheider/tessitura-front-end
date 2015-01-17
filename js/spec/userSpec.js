define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');

  describe('User', function() {
    it('has default URL root of \'/users\'', function() {
      var user = new User();
      user.urlRoot.should.equal('http://private-6f87dc-canto.apiary-mock.com/users');
    });

    describe('constructor', function() {
      it('instantiates a task collection', function() {
        var user = new User();
        (typeof user.tasks).should.not.equal('undefined');
      });

      describe('when instantiated with an ID', function() {
        beforeEach(function() {
          sinon.spy($, 'ajax');
        });

        afterEach(function() {
          $.ajax.restore();
        });

        it('makes a request to the server', function(done) {
          new User({id: 1});
          $.ajax.calledOnce.should.be.true;
          done();
        });
      });

      describe('when instantiated without an ID', function() {
        beforeEach(function() {
          sinon.spy($, 'ajax');
        });

        afterEach(function() {
          $.ajax.restore();
        });

        it('doesn\'t make a request to the server', function() {
          new User({username: 'testuser22', password: 'usertest81'});
          $.ajax.calledOnce.should.be.false;
        });
      })
    });

    describe('name() function', function() {
      it('concatenates the first and last names', function() {
        var user = new User({first_name: 'Beth', last_name: 'Franco'});
        user.name().should.equal('Beth Franco');
      })
    })
  });
});