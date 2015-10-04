Tessitura.ErrorPanelView = Tessitura.View.extend({
  className : 'panel panel-danger',
  id        : 'error-panel',
  template  : _.template(JST['partials/errorPanel']), 
  initialize: function(errors) {
    this.errors = errors;
  },

  render    : function() {
    var html = this.template({errors: this.errors});
    return Tessitura.View.prototype.render.call(this, html);
  }
});

module.exports = Tessitura.ErrorPanelView;