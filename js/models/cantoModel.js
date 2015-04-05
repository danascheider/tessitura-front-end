Canto = Canto || require('../dependencies.js');

Canto.Model = Backbone.Model.extend({
  klass       : 'Canto.Model',
  family      : 'Canto.Model',
  superFamily : 'Backbone.Model',

  types       : function() {
    return ['Backbone.Model', 'Canto.Model'];
  },

  isA         : function(type) {
    return this.types().indexOf(type) > -1 ? true : false;
  }
});

module.exports = Canto.Model;