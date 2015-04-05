module.exports = {
  toBeA: function(util, customEqualityTesters) {
    return {
      compare : function(actual, expected) {
        var result = {
          pass : function() {
            return actual.isA(expected);
          }
        };

        if(!result.pass) {
          result.message = 'Expected ' + actual + ' to be a ' + expected + ', but it is a ' + actual.klass;
        }

        return result;
      }
    };
  }
};