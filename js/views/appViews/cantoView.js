var CantoView = Backbone.View.extend({
  klass       : 'Canto.View',
  family      : 'Backbone.View',
  superFamily : '',
  types       : function() {
    return Backbone.View.prototype.types().concat(['Canto.View']);
  },
  childViews  : [],
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

module.exports = CantoView;