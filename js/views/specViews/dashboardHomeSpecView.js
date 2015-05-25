var fixtures = require('../../../spec/support/fixtures/fixtures.js');

var SpecWrapper = Tessitura.View.extend({
  template: JST['spec/dashHome'],
  el      : 'body',

  /* Core View Functions
  /***************************************************************************/

  initialize : function() {
    this.view = new Tessitura.DashboardHomeView({user: fixtures.user});
    this.render();
  },

  render  : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.$el.addClass('test');
      that.view.render();
      that.$('#view').html(that.view.$el);
    });
  }
});

module.exports = SpecWrapper;