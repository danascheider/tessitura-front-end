Canto = Canto || require('../../dependencies.js');

Backbone.View.prototype.klass = 'Backbone.View';
Backbone.View.prototype.types = function() {
  return ['Backbone.View'];
};

Backbone.View.prototype.isA   = function(type) {
  return this.types().indexOf(type) > -1 ? true : false;
};

Canto.View = Backbone.View.extend({
  klass       : 'Canto.View',
  family      : 'Backbone.View',
  superFamily : '',

  types       : function() {
    return Backbone.View.prototype.types().concat(['Canto.View']);
  },

  isA         : function(type) {
    return this.types().indexOf(type) > -1 ? true : false;
  },

  render      : function(html, action, args) {
    this.$el.html(html);
    if(!!action) { action(args); }
    this.delegateEvents();

    return this;
  }
});

module.exports = Canto.View;