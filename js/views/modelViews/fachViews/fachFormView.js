Tessitura.FachFormView = Tessitura.View.extend({
  template : JST['fachs/form'],
  tagName  : 'form',

  /* Core View Functions
  /****************************************************************************/

  render   : function() {
    return Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  }
});

module.exports = Tessitura.FachFormView