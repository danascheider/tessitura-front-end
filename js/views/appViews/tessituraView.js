Tessitura.View = Backbone.View.extend({
  klass       : 'Tessitura.View',
  family      : 'Backbone.View',
  superFamily : '',
  types       : function() {
    return Backbone.View.prototype.types().concat(['Tessitura.View']);
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

module.exports = Tessitura.View;