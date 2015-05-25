var TessituraModel = Backbone.Model.extend({
  klass       : 'Tessitura.Model',
  family      : 'Tessitura.Model',
  superFamily : 'Backbone.Model',

  types       : function() {
    return ['Backbone.Model', 'Tessitura.Model'];
  },

  isA         : function(type) {
    return this.types().indexOf(type) > -1 ? true : false;
  }
});

module.exports = TessituraModel;