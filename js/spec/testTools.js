define(function(require) {
  
  // The TestTools object is being used to DRY up some of my test code,
  // by moving code from the tests into functions defined on the TestTools
  // object, which is then required from the tests that use those methods.
  
  var TestTools = {

    // The delay function wraps some Mocha asynchronous test syntax
    // I find myself using frequently. It 

    delay: function(time, done, callback) {
      setTimeout(function() {
        try {
          callback();
          done();
        } catch(e) {
          done(e);
        }
      }, time);
    }
  };

  return TestTools;
});